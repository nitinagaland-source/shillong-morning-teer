import { SiteSettings, TeerResult, CommonNumberEntry, DreamNumberEntry, NoticeEntry, AdminSession } from '../types';

const API_BASE = '/api';
const authFetch = (input: RequestInfo | URL, init: RequestInit = {}) => fetch(input, { ...init, credentials: 'include' });

async function jsonOrThrow(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || fallback);
  return data;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/site-settings`);
  return jsonOrThrow(res, 'Failed to load site settings');
}

export async function updateSiteSettings(settings: Partial<SiteSettings>, _token?: string): Promise<SiteSettings> {
  const res = await authFetch(`${API_BASE}/site-settings`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings),
  });
  return (await jsonOrThrow(res, 'Failed to update site settings')).data;
}

export async function fetchTodayResult(): Promise<TeerResult> {
  const res = await fetch(`${API_BASE}/results/today`);
  return jsonOrThrow(res, 'Failed to fetch today result');
}

export async function updateTodayResult(result: Partial<TeerResult>, _token?: string): Promise<TeerResult> {
  const res = await authFetch(`${API_BASE}/results/today`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result),
  });
  return (await jsonOrThrow(res, 'Failed to update today result')).data;
}

export async function fetchPreviousResults(search?: string): Promise<TeerResult[]> {
  const url = search ? `${API_BASE}/results/previous?search=${encodeURIComponent(search)}` : `${API_BASE}/results/previous`;
  return jsonOrThrow(await fetch(url), 'Failed to fetch previous results');
}

export async function createPreviousResult(result: Partial<TeerResult>, _token?: string): Promise<TeerResult> {
  const res = await authFetch(`${API_BASE}/results/entry`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result),
  });
  return (await jsonOrThrow(res, 'Failed to create result')).data;
}

export async function deletePreviousResult(id: string, _token?: string): Promise<void> {
  await jsonOrThrow(await authFetch(`${API_BASE}/results/entry/${encodeURIComponent(id)}`, { method: 'DELETE' }), 'Failed to delete result');
}

export async function fetchCommonNumbers(date?: string): Promise<CommonNumberEntry[]> {
  const url = date ? `${API_BASE}/common-numbers?date=${encodeURIComponent(date)}` : `${API_BASE}/common-numbers`;
  return jsonOrThrow(await fetch(url), 'Failed to fetch common numbers');
}

export async function createCommonNumber(entry: Partial<CommonNumberEntry>, _token?: string): Promise<CommonNumberEntry> {
  const res = await authFetch(`${API_BASE}/common-numbers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
  });
  return (await jsonOrThrow(res, 'Failed to save common number')).data;
}

export async function deleteCommonNumber(id: string, _token?: string): Promise<void> {
  await jsonOrThrow(await authFetch(`${API_BASE}/common-numbers/${encodeURIComponent(id)}`, { method: 'DELETE' }), 'Failed to delete common number');
}

export async function fetchDreamNumbers(search?: string): Promise<DreamNumberEntry[]> {
  const url = search ? `${API_BASE}/dream-numbers?q=${encodeURIComponent(search)}` : `${API_BASE}/dream-numbers`;
  return jsonOrThrow(await fetch(url), 'Failed to fetch dream numbers');
}

export async function createDreamNumber(entry: Partial<DreamNumberEntry>, _token?: string): Promise<DreamNumberEntry> {
  const res = await authFetch(`${API_BASE}/dream-numbers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
  });
  return (await jsonOrThrow(res, 'Failed to create dream number')).data;
}

export async function updateDreamNumber(id: string, entry: Partial<DreamNumberEntry>, _token?: string): Promise<DreamNumberEntry> {
  const res = await authFetch(`${API_BASE}/dream-numbers/${encodeURIComponent(id)}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry),
  });
  return (await jsonOrThrow(res, 'Failed to update dream number')).data;
}

export async function deleteDreamNumber(id: string, _token?: string): Promise<void> {
  await jsonOrThrow(await authFetch(`${API_BASE}/dream-numbers/${encodeURIComponent(id)}`, { method: 'DELETE' }), 'Failed to delete dream number');
}

export async function fetchNotices(): Promise<NoticeEntry[]> {
  return jsonOrThrow(await fetch(`${API_BASE}/notices`), 'Failed to fetch notices');
}

export async function createNotice(notice: Partial<NoticeEntry>, _token?: string): Promise<NoticeEntry> {
  const res = await authFetch(`${API_BASE}/notices`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(notice),
  });
  return (await jsonOrThrow(res, 'Failed to create notice')).data;
}

export async function deleteNotice(id: string, _token?: string): Promise<void> {
  await jsonOrThrow(await authFetch(`${API_BASE}/notices/${encodeURIComponent(id)}`, { method: 'DELETE' }), 'Failed to delete notice');
}

export async function adminLogin(email: string, password: string): Promise<AdminSession> {
  const res = await authFetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  const data = await jsonOrThrow(res, 'Login failed. Invalid credentials.');
  return { token: 'http-only-cookie', email: data.user.email, role: data.user.role, expires_at: data.expiresAt };
}

export async function checkAdminSession(_token?: string): Promise<boolean> {
  try { return (await authFetch(`${API_BASE}/auth/me`)).ok; } catch { return false; }
}

export async function adminLogout(): Promise<void> {
  await authFetch(`${API_BASE}/auth/logout`, { method: 'POST' });
}



