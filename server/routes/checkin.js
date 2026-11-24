import { Router } from 'express';
import { generateReview } from '../llm.js';
import { insertCheckin } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { rating, tags, note, bed_id, property } = req.body;

    // --- Validation ---
    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: 'rating is required' });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    }
    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags must be an array' });
    }
    if (typeof note !== 'string') {
      return res.status(400).json({ error: 'note must be a string' });
    }
    if (!bed_id || typeof bed_id !== 'string') {
      return res.status(400).json({ error: 'bed_id is required' });
    }
    if (!property || typeof property !== 'string') {
      return res.status(400).json({ error: 'property is required' });
    }

    // --- Generate review ---
    const generated_review = await generateReview(ratingNum, tags, note);

    // --- Persist (reuse session_id if available to link with scan event) ---
    const id = req.body.session_id || req.body.id || crypto.randomUUID();
    const created_at = new Date().toISOString();

    insertCheckin({
      id,
      property,
      bed_id,
      rating: ratingNum,
      tags: JSON.stringify(tags),
      raw_note: note,
      generated_review,
      scan_started: 1,
      copied_google_link: 0,
      joined_community: 0,
      created_at,
    });

    return res.status(201).json({ id, generated_review });
  } catch (err) {
    console.error('[checkin] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
