import app from '../server.ts';

export default function handler(req: any, res: any) {
  const rawPath = req.query?.path;
  const path = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath || '');

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === 'path' || value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else {
      params.append(key, String(value));
    }
  }

  const query = params.toString();
  req.url = `/api/${path.replace(/^\/+/, '')}${query ? `?${query}` : ''}`;
  return app(req, res);
}
