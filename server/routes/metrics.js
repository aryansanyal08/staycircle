import { Router } from 'express';
import { getMetrics, getAllCheckins } from '../db.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/metrics
// ---------------------------------------------------------------------------
router.get('/', (_req, res) => {
  try {
    const metrics = getMetrics();

    const totalScans = metrics.totalScans || 0;
    const totalCheckins = metrics.totalCheckins || 0;

    const completionPct =
      totalScans > 0 ? ((totalCheckins / totalScans) * 100).toFixed(1) : '0.0';

    return res.json({ ...metrics, completionPct });
  } catch (err) {
    console.error('[metrics] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/metrics/csv
// ---------------------------------------------------------------------------
router.get('/csv', (_req, res) => {
  try {
    const rows = getAllCheckins();

    const headers = [
      'id',
      'property',
      'bed_id',
      'rating',
      'tags',
      'raw_note',
      'generated_review',
      'scan_started',
      'copied_google_link',
      'joined_community',
      'created_at',
    ];

    function escapeCsv(value) {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Wrap in quotes if the value contains a comma, double-quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const csvLines = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')),
    ];

    const csv = csvLines.join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=checkins.csv');
    return res.send(csv);
  } catch (err) {
    console.error('[metrics/csv] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
