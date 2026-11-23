import { Router } from 'express';
import { updateCheckinFlag, insertCheckin } from '../db.js';

const router = Router();

const ALLOWED_EVENTS = new Set(['scan_started', 'copied_google_link', 'joined_community']);

router.post('/', (req, res) => {
  try {
    const { id, event } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'id is required' });
    }

    if (!event || !ALLOWED_EVENTS.has(event)) {
      return res.status(400).json({
        error: `event must be one of: ${[...ALLOWED_EVENTS].join(', ')}`,
      });
    }

    // For scan_started, create a stub row if not already in DB (session pre-checkin)
    if (event === 'scan_started') {
      try {
        insertCheckin({
          id,
          property: req.body.property || null,
          bed_id: req.body.bed_id || null,
          rating: null,
          tags: '[]',
          raw_note: null,
          generated_review: null,
          scan_started: 1,
          copied_google_link: 0,
          joined_community: 0,
          created_at: new Date().toISOString(),
        });
      } catch {
        // Row already exists (duplicate scan) — just update the flag
        updateCheckinFlag(id, 'scan_started', 1);
      }
      return res.json({ ok: true });
    }

    updateCheckinFlag(id, event, 1);

    return res.json({ ok: true });
  } catch (err) {
    console.error('[track] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
