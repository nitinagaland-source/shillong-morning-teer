import 'dotenv/config';
import crypto from 'crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { DocumentReference, getFirestore } from 'firebase-admin/firestore';
import {
  initialSiteSettings,
  initialPreviousResults,
  initialCommonNumbers,
  initialDreamNumbers,
  initialNotices,
} from './src/data/initialData';

function env(name: string): string {
  return (process.env[name] || '').trim();
}

function displayToKey(value: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!m) throw new Error(`Invalid date: ${value}`);
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function commonDocId(dateKey: string, category: string) {
  return `${dateKey}__${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

const projectId = env('FIREBASE_PROJECT_ID');
const clientEmail = env('FIREBASE_CLIENT_EMAIL');
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();

if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env first.');
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

async function createIfMissing(ref: DocumentReference, data: Record<string, unknown>) {
  const snap = await ref.get();
  if (!snap.exists) await ref.create(data);
}

async function main() {
  const now = new Date().toISOString();

  await createIfMissing(db.collection('site_settings').doc('main'), {
    site_name: initialSiteSettings.site_name,
    game_name: initialSiteSettings.game_name,
    logo_url: initialSiteSettings.logo_url,
    top_bar_bg_color: initialSiteSettings.top_bar_bg_color,
    announcement_ticker: initialSiteSettings.announcement_ticker || '',
    created_at: now,
    updated_at: now,
  });

  for (const item of initialPreviousResults) {
    const dateKey = displayToKey(item.date);
    await createIfMissing(db.collection('results').doc(dateKey), {
      result_date: dateKey,
      round_1_label: item.round_1_label,
      round_1_time: item.round_1_time,
      round_1_number: item.round_1_number,
      round_2_label: item.round_2_label,
      round_2_time: item.round_2_time,
      round_2_number: item.round_2_number,
      status: item.status || 'completed',
      created_at: item.created_at,
      updated_at: item.updated_at,
    });
  }

  for (const item of initialCommonNumbers) {
    const dateKey = displayToKey(item.date);
    await createIfMissing(db.collection('common_numbers').doc(commonDocId(dateKey, item.category_label)), {
      result_date: dateKey,
      category_label: item.category_label,
      numbers: item.numbers,
      notes: item.notes || '',
      created_at: item.created_at,
      updated_at: item.created_at,
    });
  }

  for (const item of initialDreamNumbers) {
    const id = crypto.createHash('sha256').update(item.keyword).digest('hex').slice(0, 24);
    await createIfMissing(db.collection('dream_numbers').doc(id), {
      keyword: item.keyword,
      number: item.number,
      description: item.description,
      created_at: now,
      updated_at: now,
    });
  }

  for (const item of initialNotices) {
    await createIfMissing(db.collection('notices').doc(item.id), {
      title: item.title,
      date: item.date,
      body: item.body,
      priority: item.priority || 'normal',
      created_at: item.created_at,
      updated_at: item.created_at,
    });
  }

  console.log('Firebase seed complete. Existing documents were left unchanged.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
