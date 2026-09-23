import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { DocumentSnapshot, Firestore, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';

const app = express();

// Never cache live API responses. Results and daily numbers must reflect the current IST day immediately.
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.set('trust proxy', 1);

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
const COOKIE_NAME = 'teer_admin_session';
const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000;

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function env(name: string): string {
  return (process.env[name] || '').trim();
}

let firestore: Firestore | null = null;
function getDb(): Firestore {
  if (firestore) return firestore;

  const projectId = env('FIREBASE_PROJECT_ID');
  const clientEmail = env('FIREBASE_CLIENT_EMAIL');
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n').trim();

  if (!projectId || !clientEmail || !privateKey) {
    throw new HttpError(
      503,
      'Firebase is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  firestore = getFirestore();
  firestore.settings({ ignoreUndefinedProperties: true });
  return firestore;
}

function getISTParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { year: values.year, month: values.month, day: values.day };
}

function getTodayISTKey(date = new Date()): string {
  const { year, month, day } = getISTParts(date);
  return `${year}-${month}-${day}`;
}

function keyToDisplay(dateKey: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m) return dateKey;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function displayToKey(value: string): string {
  const trimmed = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!m) throw new HttpError(400, 'Date must be DD/MM/YYYY.');
  const key = `${m[3]}-${m[2]}-${m[1]}`;
  const d = new Date(`${key}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== key) {
    throw new HttpError(400, 'Invalid date.');
  }
  return key;
}

function randomTwoDigit(): string {
  return String(crypto.randomInt(0, 100)).padStart(2, '0');
}
function randomDigit(): string {
  return String(crypto.randomInt(0, 10));
}
function uniqueRandom(count: number, generator: () => string): string[] {
  const values = new Set<string>();
  while (values.size < count) values.add(generator());
  return [...values];
}

function normalizeResultNumber(value: unknown): string {
  const text = String(value ?? '').trim().toUpperCase();
  if (!text || text === 'X') return 'X';
  if (!/^\d{1,2}$/.test(text)) throw new HttpError(400, 'Result must be X or a number from 00 to 99.');
  return text.padStart(2, '0');
}

function cleanText(value: unknown, max = 200): string {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

function cleanArray(values: unknown, maxItems = 12): string[] {
  if (!Array.isArray(values)) throw new HttpError(400, 'Numbers must be an array.');
  return values.slice(0, maxItems).map((v) => cleanText(v, 20)).filter(Boolean);
}

function snapshotToData(snap: DocumentSnapshot) {
  return snap.exists ? { id: snap.id, ...(snap.data() || {}) } : null;
}

function resultRowToApi(row: any) {
  return {
    id: row.id,
    date: keyToDisplay(row.result_date),
    round_1_label: row.round_1_label,
    round_1_time: row.round_1_time,
    round_1_number: row.round_1_number,
    round_2_label: row.round_2_label,
    round_2_time: row.round_2_time,
    round_2_number: row.round_2_number,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function commonRowToApi(row: any) {
  return {
    id: row.id,
    date: keyToDisplay(row.result_date),
    category_label: row.category_label,
    numbers: row.numbers || [],
    notes: row.notes || '',
    created_at: row.created_at,
  };
}

function dreamRowToApi(row: any) {
  return {
    id: row.id,
    keyword: row.keyword,
    number: row.number,
    description: row.description,
  };
}

function commonDocId(dateKey: string, category: string) {
  return `${dateKey}__${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function adminDocId(email: string) {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

async function audit(action: string, req: Request, details?: Record<string, unknown>, targetTable?: string, targetId?: string) {
  try {
    const session = (req as any).adminSession;
    await getDb().collection('admin_audit_logs').add({
      action,
      target_table: targetTable || 'system',
      target_id: targetId || null,
      actor_email: session?.email || null,
      ip_address: req.ip || null,
      details: details || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Audit log write failed:', error);
  }
}

async function ensureSiteSettings() {
  const db = getDb();
  const ref = db.collection('site_settings').doc('main');
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      const now = new Date().toISOString();
      tx.create(ref, {
        site_name: 'Shillongmorningteer',
        game_name: 'SHILLONG MORNING TEER',
        logo_url: '',
        top_bar_bg_color: '#96d8ea',
        announcement_ticker: 'Live Shillong Morning Teer results. F/R 10:30 AM & S/R 11:30 AM.',
        created_at: now,
        updated_at: now,
      });
    }
  });
}

async function ensureTodayResult(todayKey: string) {
  const db = getDb();
  const ref = db.collection('results').doc(todayKey);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      const now = new Date().toISOString();
      tx.create(ref, {
        result_date: todayKey,
        round_1_label: 'F/R(10:30 AM)',
        round_1_time: '10:30 AM',
        round_1_number: 'X',
        round_2_label: 'S/R(11:30 AM)',
        round_2_time: '11:30 AM',
        round_2_number: 'X',
        status: 'awaiting',
        created_at: now,
        updated_at: now,
      });
    }
  });
}

async function ensureCommonNumbers(todayKey: string) {
  const db = getDb();
  const rows = [
    { category_label: 'Direct', numbers: uniqueRandom(3, randomTwoDigit) },
    { category_label: 'House', numbers: uniqueRandom(2, randomDigit) },
    { category_label: 'Ending', numbers: uniqueRandom(2, randomDigit) },
  ];

  await Promise.all(
    rows.map(async (row) => {
      const ref = db.collection('common_numbers').doc(commonDocId(todayKey, row.category_label));
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) {
          const now = new Date().toISOString();
          tx.create(ref, {
            result_date: todayKey,
            category_label: row.category_label,
            numbers: row.numbers,
            notes: 'Auto-generated once for the day at 12:00 AM IST',
            created_at: now,
            updated_at: now,
          });
        }
      });
    })
  );
}

const DREAM_SYMBOLS = [
  'Water / River', 'Snake / Serpent', 'Flying Arrow / Bow', 'Fire / Flame',
  'Money / Gold', 'Elephant / Tiger', 'Fish / Fishing', 'Forest / Tree',
  'Bird / Eagle', 'Stone / Monolith', 'Wedding / Marriage', 'Rain / Umbrella',
];

async function ensureDailyDream(todayKey: string) {
  const db = getDb();
  const ref = db.collection('daily_dream_numbers').doc(todayKey);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      const now = new Date().toISOString();
      tx.create(ref, {
        result_date: todayKey,
        symbol: DREAM_SYMBOLS[crypto.randomInt(0, DREAM_SYMBOLS.length)],
        direct_numbers: uniqueRandom(4, randomTwoDigit),
        house_number: randomDigit(),
        ending_number: randomDigit(),
        source: 'auto',
        created_at: now,
        updated_at: now,
      });
    }
  });
}

async function ensureDailyState() {
  const todayKey = getTodayISTKey();
  await Promise.all([
    ensureSiteSettings(),
    ensureTodayResult(todayKey),
    ensureCommonNumbers(todayKey),
    ensureDailyDream(todayKey),
  ]);
  return todayKey;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512').toString('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const aa = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

async function ensureAdminCredential() {
  const db = getDb();
  const adminEmail = env('ADMIN_EMAIL').toLowerCase();
  const adminPassword = env('ADMIN_PASSWORD');
  if (!adminEmail || !adminPassword) {
    throw new HttpError(503, 'Admin credentials are not configured. Add ADMIN_EMAIL and ADMIN_PASSWORD.');
  }

  const ref = db.collection('admin_credentials').doc(adminDocId(adminEmail));
  const existing = await ref.get();
  if (existing.exists) return { id: existing.id, ...(existing.data() || {}) } as any;

  const salt = crypto.randomBytes(24).toString('hex');
  const now = new Date().toISOString();
  const row = {
    email: adminEmail,
    password_hash: hashPassword(adminPassword, salt),
    password_salt: salt,
    session_version: 1,
    created_at: now,
    updated_at: now,
  };

  try {
    await ref.create(row);
    return { id: ref.id, ...row } as any;
  } catch (error: any) {
    if (error?.code === 6 || error?.code === 'already-exists') {
      const snap = await ref.get();
      return { id: snap.id, ...(snap.data() || {}) } as any;
    }
    throw error;
  }
}

function sessionSecret(): string {
  const secret = env('SESSION_SECRET');
  if (secret.length < 32) throw new HttpError(503, 'SESSION_SECRET must be at least 32 characters.');
  return secret;
}

function signSession(payload: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifySessionToken(token: string): any | null {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(body).digest();
  const actual = Buffer.from(sig, 'base64url');
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload?.email || !payload?.exp || Date.now() >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
      const i = part.indexOf('=');
      return i < 0 ? [part, ''] : [part.slice(0, i), decodeURIComponent(part.slice(i + 1))];
    })
  );
}

function setSessionCookie(res: Response, token: string, expiresAt: number) {
  const maxAge = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ];
  if (IS_PRODUCTION) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res: Response) {
  const parts = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (IS_PRODUCTION) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = parseCookies(req)[COOKIE_NAME];
    const payload = verifySessionToken(token);
    if (!payload) return res.status(401).json({ error: 'Admin session required.' });

    const snap = await getDb().collection('admin_credentials').doc(adminDocId(payload.email)).get();
    const credential: any = snapshotToData(snap);
    if (!credential || Number(credential.session_version) !== Number(payload.ver)) {
      clearSessionCookie(res);
      return res.status(401).json({ error: 'Admin session expired.' });
    }

    (req as any).adminSession = payload;
    next();
  } catch (error) {
    next(error);
  }
}

const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
function loginKey(req: Request, email: string) {
  return `${req.ip || 'unknown'}|${email.toLowerCase()}`;
}
function loginAllowed(key: string) {
  const state = loginAttempts.get(key);
  if (!state) return true;
  if (state.lockUntil && state.lockUntil > Date.now()) return false;
  if (state.lockUntil && state.lockUntil <= Date.now()) loginAttempts.delete(key);
  return true;
}
function recordLoginFailure(key: string) {
  const current = loginAttempts.get(key) || { count: 0, lockUntil: 0 };
  current.count += 1;
  if (current.count >= 5) current.lockUntil = Date.now() + 15 * 60 * 1000;
  loginAttempts.set(key, current);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  next();
});

app.use(express.json({ limit: '100kb', type: 'application/json' }));

app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== req.get('host')) return res.status(403).json({ error: 'Cross-site request blocked.' });
      } catch {
        return res.status(403).json({ error: 'Invalid request origin.' });
      }
    }
  }
  next();
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = cleanText(req.body?.email, 160).toLowerCase();
    const password = String(req.body?.password || '');
    const key = loginKey(req, email);
    if (!loginAllowed(key)) return res.status(429).json({ error: 'Too many failed attempts. Try again later.' });

    const credential: any = await ensureAdminCredential();
    const candidateHash = hashPassword(password, credential.password_salt);
    if (email !== credential.email || !safeEqualHex(candidateHash, credential.password_hash)) {
      recordLoginFailure(key);
      await new Promise((resolve) => setTimeout(resolve, 350));
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    loginAttempts.delete(key);
    const expiresAt = Date.now() + ADMIN_SESSION_MS;
    const token = signSession({
      email: credential.email,
      role: 'superadmin',
      ver: credential.session_version,
      iat: Date.now(),
      exp: expiresAt,
      nonce: crypto.randomBytes(12).toString('hex'),
    });
    setSessionCookie(res, token, expiresAt);
    (req as any).adminSession = { email: credential.email };
    await audit('ADMIN_LOGIN_SUCCESS', req, { userAgent: req.get('user-agent') || '' }, 'admin_credentials', credential.id);
    res.json({ user: { email: credential.email, role: 'superadmin' }, expiresAt });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  const session = (req as any).adminSession;
  res.json({ user: { email: session.email, role: session.role || 'superadmin' }, expiresAt: session.exp });
});

app.post('/api/auth/logout', requireAdmin, async (req, res) => {
  clearSessionCookie(res);
  await audit('ADMIN_LOGOUT', req, {}, 'admin_credentials');
  res.json({ ok: true });
});

app.post('/api/auth/change-password', requireAdmin, async (req, res, next) => {
  try {
    const currentPassword = String(req.body?.currentPassword || '');
    const newPassword = String(req.body?.newPassword || '');
    if (newPassword.length < 12 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      throw new HttpError(400, 'New password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.');
    }

    const session = (req as any).adminSession;
    const ref = getDb().collection('admin_credentials').doc(adminDocId(session.email));
    const snap = await ref.get();
    const credential: any = snapshotToData(snap);
    if (!credential) throw new HttpError(404, 'Admin account not found.');
    if (!safeEqualHex(hashPassword(currentPassword, credential.password_salt), credential.password_hash)) {
      throw new HttpError(401, 'Current password is incorrect.');
    }

    const salt = crypto.randomBytes(24).toString('hex');
    const nextVersion = Number(credential.session_version || 1) + 1;
    await ref.update({
      password_hash: hashPassword(newPassword, salt),
      password_salt: salt,
      session_version: nextVersion,
      updated_at: new Date().toISOString(),
    });

    clearSessionCookie(res);
    await audit('ADMIN_PASSWORD_CHANGED', req, {}, 'admin_credentials', ref.id);
    res.json({ ok: true, message: 'Password updated. Please sign in again.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/site-settings', async (_req, res, next) => {
  try {
    await ensureSiteSettings();
    const snap = await getDb().collection('site_settings').doc('main').get();
    res.json(snapshotToData(snap));
  } catch (error) { next(error); }
});

app.put('/api/site-settings', requireAdmin, async (req, res, next) => {
  try {
    const patch = {
      site_name: cleanText(req.body?.site_name, 80),
      game_name: cleanText(req.body?.game_name, 100),
      logo_url: cleanText(req.body?.logo_url, 500),
      top_bar_bg_color: cleanText(req.body?.top_bar_bg_color, 30),
      announcement_ticker: cleanText(req.body?.announcement_ticker, 300),
      updated_at: new Date().toISOString(),
    };
    const ref = getDb().collection('site_settings').doc('main');
    await ref.set(patch, { merge: true });
    const data = snapshotToData(await ref.get());
    await audit('SITE_SETTINGS_UPDATED', req, {}, 'site_settings', 'main');
    res.json({ data });
  } catch (error) { next(error); }
});

app.get('/api/results/today', async (_req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const data = snapshotToData(await getDb().collection('results').doc(todayKey).get());
    if (!data) throw new HttpError(404, 'Today result not found.');
    res.json(resultRowToApi(data));
  } catch (error) { next(error); }
});

app.post('/api/results/today', requireAdmin, async (req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const r1 = normalizeResultNumber(req.body?.round_1_number);
    const r2 = normalizeResultNumber(req.body?.round_2_number);
    const status = r1 !== 'X' && r2 !== 'X' ? 'completed' : r1 !== 'X' || r2 !== 'X' ? 'partial' : 'awaiting';
    const patch = {
      round_1_label: cleanText(req.body?.round_1_label || 'F/R(10:30 AM)', 60),
      round_1_time: cleanText(req.body?.round_1_time || '10:30 AM', 20),
      round_1_number: r1,
      round_2_label: cleanText(req.body?.round_2_label || 'S/R(11:30 AM)', 60),
      round_2_time: cleanText(req.body?.round_2_time || '11:30 AM', 20),
      round_2_number: r2,
      status,
      updated_at: new Date().toISOString(),
    };
    const ref = getDb().collection('results').doc(todayKey);
    await ref.set(patch, { merge: true });
    const data = snapshotToData(await ref.get());
    await audit('TODAY_RESULT_UPDATED', req, { round1: r1, round2: r2 }, 'results', ref.id);
    res.json({ data: resultRowToApi(data) });
  } catch (error) { next(error); }
});

app.get('/api/results/previous', async (req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const snap = await getDb().collection('results')
      .where('result_date', '<', todayKey)
      .orderBy('result_date', 'desc')
      .limit(365)
      .get();
    let results = snap.docs.map((d) => resultRowToApi({ id: d.id, ...d.data() }));
    const search = cleanText(req.query.search, 50).toLowerCase();
    if (search) results = results.filter((r: any) => JSON.stringify(r).toLowerCase().includes(search));
    res.json(results);
  } catch (error) { next(error); }
});

app.post('/api/results/entry', requireAdmin, async (req, res, next) => {
  try {
    const resultDate = displayToKey(req.body?.date);
    if (resultDate >= getTodayISTKey()) throw new HttpError(400, 'Previous Results must use a date before today.');
    const r1 = normalizeResultNumber(req.body?.round_1_number);
    const r2 = normalizeResultNumber(req.body?.round_2_number);
    const status = r1 !== 'X' && r2 !== 'X' ? 'completed' : r1 !== 'X' || r2 !== 'X' ? 'partial' : 'awaiting';
    const ref = getDb().collection('results').doc(resultDate);
    const old = await ref.get();
    const now = new Date().toISOString();
    const row = {
      result_date: resultDate,
      round_1_label: 'F/R(10:30 AM)',
      round_1_time: '10:30 AM',
      round_1_number: r1,
      round_2_label: 'S/R(11:30 AM)',
      round_2_time: '11:30 AM',
      round_2_number: r2,
      status,
      created_at: old.exists ? old.data()?.created_at || now : now,
      updated_at: now,
    };
    await ref.set(row, { merge: true });
    const data = snapshotToData(await ref.get());
    await audit('HISTORICAL_RESULT_UPSERTED', req, { date: resultDate }, 'results', ref.id);
    res.json({ data: resultRowToApi(data) });
  } catch (error) { next(error); }
});

app.delete('/api/results/entry/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = cleanText(req.params.id, 100);
    const ref = getDb().collection('results').doc(id);
    const snap = await ref.get();
    const row: any = snapshotToData(snap);
    if (!row) throw new HttpError(404, 'Result not found.');
    if (String(row.result_date) >= getTodayISTKey()) throw new HttpError(400, 'Today result cannot be deleted from Previous Results.');
    await ref.delete();
    await audit('HISTORICAL_RESULT_DELETED', req, {}, 'results', id);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/common-numbers/today', async (_req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const snap = await getDb().collection('common_numbers').where('result_date', '==', todayKey).get();
    const rows = snap.docs.map((d) => commonRowToApi({ id: d.id, ...d.data() }));
    rows.sort((a: any, b: any) => a.category_label.localeCompare(b.category_label));
    res.json(rows);
  } catch (error) { next(error); }
});

app.get('/api/common-numbers/daily', async (_req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const snap = await getDb().collection('common_numbers').where('result_date', '==', todayKey).get();
    const rows = snap.docs.map((d) => commonRowToApi({ id: d.id, ...d.data() }));
    rows.sort((a: any, b: any) => a.category_label.localeCompare(b.category_label));
    res.json({ date: keyToDisplay(todayKey), entries: rows });
  } catch (error) { next(error); }
});

app.get('/api/common-numbers', async (req, res, next) => {
  try {
    await ensureDailyState();
    const rawDate = cleanText(req.query.date, 20);
    let docs: QueryDocumentSnapshot[] = [];
    if (rawDate) {
      const key = displayToKey(rawDate);
      const snap = await getDb().collection('common_numbers').where('result_date', '==', key).get();
      docs = snap.docs;
    } else {
      const snap = await getDb().collection('common_numbers').orderBy('result_date', 'desc').limit(400).get();
      docs = snap.docs;
    }
    const rows = docs.map((d) => commonRowToApi({ id: d.id, ...d.data() }));
    rows.sort((a: any, b: any) => {
      const byDate = displayToKey(b.date).localeCompare(displayToKey(a.date));
      return byDate || a.category_label.localeCompare(b.category_label);
    });
    res.json(rows);
  } catch (error) { next(error); }
});

app.post('/api/common-numbers', requireAdmin, async (req, res, next) => {
  try {
    const resultDate = displayToKey(req.body?.date || keyToDisplay(getTodayISTKey()));
    const category = cleanText(req.body?.category_label, 30);
    if (!['Direct', 'House', 'Ending', 'Special Target'].includes(category)) throw new HttpError(400, 'Invalid common-number category.');
    const numbers = cleanArray(req.body?.numbers);
    if (!numbers.length) throw new HttpError(400, 'Add at least one number.');
    const ref = getDb().collection('common_numbers').doc(commonDocId(resultDate, category));
    const old = await ref.get();
    const now = new Date().toISOString();
    const row = {
      result_date: resultDate,
      category_label: category,
      numbers,
      notes: cleanText(req.body?.notes, 300),
      created_at: old.exists ? old.data()?.created_at || now : now,
      updated_at: now,
    };
    await ref.set(row, { merge: true });
    const data = snapshotToData(await ref.get());
    await audit('COMMON_NUMBER_UPSERTED', req, { date: resultDate, category }, 'common_numbers', ref.id);
    res.json({ data: commonRowToApi(data) });
  } catch (error) { next(error); }
});

app.delete('/api/common-numbers/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = cleanText(req.params.id, 160);
    const ref = getDb().collection('common_numbers').doc(id);
    if (!(await ref.get()).exists) throw new HttpError(404, 'Common number entry not found.');
    await ref.delete();
    await audit('COMMON_NUMBER_DELETED', req, {}, 'common_numbers', id);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/dream-numbers/daily', async (_req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const data: any = snapshotToData(await getDb().collection('daily_dream_numbers').doc(todayKey).get());
    if (!data) throw new HttpError(404, 'Daily dream number not found.');
    res.json({
      id: data.id,
      date: keyToDisplay(data.result_date),
      symbol: data.symbol,
      direct_numbers: data.direct_numbers || [],
      house_number: data.house_number,
      ending_number: data.ending_number,
      source: data.source,
      updated_at: data.updated_at,
    });
  } catch (error) { next(error); }
});

app.put('/api/dream-numbers/daily', requireAdmin, async (req, res, next) => {
  try {
    const todayKey = await ensureDailyState();
    const directNumbers = cleanArray(req.body?.direct_numbers, 8);
    if (!directNumbers.length) throw new HttpError(400, 'Add at least one daily dream number.');
    const patch = {
      symbol: cleanText(req.body?.symbol, 120) || 'Daily Dream Pick',
      direct_numbers: directNumbers,
      house_number: cleanText(req.body?.house_number, 2),
      ending_number: cleanText(req.body?.ending_number, 2),
      source: 'admin',
      updated_at: new Date().toISOString(),
    };
    const ref = getDb().collection('daily_dream_numbers').doc(todayKey);
    await ref.set(patch, { merge: true });
    const data = snapshotToData(await ref.get());
    await audit('DAILY_DREAM_UPDATED', req, {}, 'daily_dream_numbers', ref.id);
    res.json({ data });
  } catch (error) { next(error); }
});

app.get('/api/dream-numbers', async (req, res, next) => {
  try {
    const snap = await getDb().collection('dream_numbers').orderBy('keyword', 'asc').limit(500).get();
    let rows = snap.docs.map((d) => dreamRowToApi({ id: d.id, ...d.data() }));
    const q = cleanText(req.query.q, 80).toLowerCase();
    if (q) rows = rows.filter((row: any) => row.keyword.toLowerCase().includes(q));
    res.json(rows);
  } catch (error) { next(error); }
});

app.post('/api/dream-numbers', requireAdmin, async (req, res, next) => {
  try {
    const row = {
      keyword: cleanText(req.body?.keyword, 120),
      number: cleanText(req.body?.number, 120),
      description: cleanText(req.body?.description, 700),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (!row.keyword || !row.number) throw new HttpError(400, 'Keyword and number are required.');
    const ref = await getDb().collection('dream_numbers').add(row);
    const data = snapshotToData(await ref.get());
    await audit('DREAM_NUMBER_CREATED', req, {}, 'dream_numbers', ref.id);
    res.json({ data: dreamRowToApi(data) });
  } catch (error) { next(error); }
});

app.put('/api/dream-numbers/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = cleanText(req.params.id, 160);
    const patch = {
      keyword: cleanText(req.body?.keyword, 120),
      number: cleanText(req.body?.number, 120),
      description: cleanText(req.body?.description, 700),
      updated_at: new Date().toISOString(),
    };
    if (!patch.keyword || !patch.number) throw new HttpError(400, 'Keyword and number are required.');
    const ref = getDb().collection('dream_numbers').doc(id);
    if (!(await ref.get()).exists) throw new HttpError(404, 'Dream number not found.');
    await ref.update(patch);
    const data = snapshotToData(await ref.get());
    await audit('DREAM_NUMBER_UPDATED', req, {}, 'dream_numbers', id);
    res.json({ data: dreamRowToApi(data) });
  } catch (error) { next(error); }
});

app.delete('/api/dream-numbers/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = cleanText(req.params.id, 160);
    const ref = getDb().collection('dream_numbers').doc(id);
    if (!(await ref.get()).exists) throw new HttpError(404, 'Dream number not found.');
    await ref.delete();
    await audit('DREAM_NUMBER_DELETED', req, {}, 'dream_numbers', id);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/notices', async (_req, res, next) => {
  try {
    const snap = await getDb().collection('notices').orderBy('created_at', 'desc').limit(100).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) { next(error); }
});

app.post('/api/notices', requireAdmin, async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const row = {
      title: cleanText(req.body?.title, 160),
      date: cleanText(req.body?.date, 20) || keyToDisplay(getTodayISTKey()),
      body: cleanText(req.body?.body, 3000),
      priority: req.body?.priority === 'high' ? 'high' : 'normal',
      created_at: now,
      updated_at: now,
    };
    if (!row.title || !row.body) throw new HttpError(400, 'Title and notice content are required.');
    const ref = await getDb().collection('notices').add(row);
    const data = snapshotToData(await ref.get());
    await audit('NOTICE_CREATED', req, {}, 'notices', ref.id);
    res.json({ data });
  } catch (error) { next(error); }
});

app.delete('/api/notices/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = cleanText(req.params.id, 160);
    const ref = getDb().collection('notices').doc(id);
    if (!(await ref.get()).exists) throw new HttpError(404, 'Notice not found.');
    await ref.delete();
    await audit('NOTICE_DELETED', req, {}, 'notices', id);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/admin/audit-logs', requireAdmin, async (_req, res, next) => {
  try {
    const snap = await getDb().collection('admin_audit_logs').orderBy('created_at', 'desc').limit(200).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) { next(error); }
});

app.get('/api/cron/daily', async (req, res, next) => {
  try {
    const secret = env('CRON_SECRET');
    if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized.' });
    const todayKey = await ensureDailyState();
    res.json({ ok: true, date: keyToDisplay(todayKey), ran_at: new Date().toISOString() });
  } catch (error) { next(error); }
});

app.get('/api/health', async (_req, res) => {
  const configured = Boolean(
    env('FIREBASE_PROJECT_ID') &&
    env('FIREBASE_CLIENT_EMAIL') &&
    process.env.FIREBASE_PRIVATE_KEY &&
    env('ADMIN_EMAIL') &&
    env('ADMIN_PASSWORD') &&
    env('SESSION_SECRET') &&
    env('CRON_SECRET')
  );
  res.status(configured ? 200 : 503).json({
    ok: configured,
    configured,
    database: 'firebase-firestore',
    timezone: 'Asia/Kolkata',
    now: new Date().toISOString(),
  });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  const message = err?.message || 'Internal server error';
  res.status(500).json({ error: IS_PRODUCTION ? 'Internal server error.' : message });
});

export default app;
