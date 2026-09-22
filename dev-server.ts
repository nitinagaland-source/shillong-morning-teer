import 'dotenv/config';
import app from './server';
import { createServer as createViteServer } from 'vite';

const port = Number(process.env.PORT || 3000);
const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
app.use(vite.middlewares);
app.listen(port, '0.0.0.0', () => {
  console.log(`Local server running at http://localhost:${port}`);
});
