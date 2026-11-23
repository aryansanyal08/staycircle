import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import checkinRouter from './routes/checkin.js';
import trackRouter from './routes/track.js';
import metricsRouter from './routes/metrics.js';
import qrRouter from './routes/qr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow Vite dev server
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());

// API routes
app.use('/api/checkin', checkinRouter);
app.use('/api/track', trackRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/qr', qrRouter);

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// Initialise DB then start
initDb();

app.listen(PORT, () => {
  console.log(`\n🚀  StayCircle API running at http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`    Frontend dev server expected at http://localhost:5173`);
  }
});
