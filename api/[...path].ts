import app from '../server.ts';

export default function handler(req: any, res: any) {
  const path = req.query.path;
  const parts = Array.isArray(path) ? path : path ? [path] : [];
  const queryIndex = req.url.indexOf('?');
  const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
  req.url = '/api/' + parts.join('/') + query;
  return app(req, res);
}
