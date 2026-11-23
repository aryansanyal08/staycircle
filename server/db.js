import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '..', 'staycircle.json');

// Optional notice for PostgreSQL
if (process.env.DATABASE_URL) {
  console.log('[db] DATABASE_URL provided. To connect directly to Postgres, install pg. Falling back to local storage.');
}

// In-memory cache synced with disk
let checkins = [];

function loadData() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      checkins = JSON.parse(raw);
    } else {
      checkins = [];
      saveData();
    }
  } catch (err) {
    console.error('[db] Error reading database file:', err.message);
    checkins = [];
  }
}

function saveData() {
  try {
    const tmpPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(checkins, null, 2), 'utf-8');
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('[db] Error saving database file:', err.message);
  }
}

// ---------------------------------------------------------------------------
// initDb — creates/initializes local JSON storage
// ---------------------------------------------------------------------------
export function initDb() {
  loadData();
  console.log(`[db] Local JSON Database initialised with ${checkins.length} records at ${DB_PATH}`);
}

// ---------------------------------------------------------------------------
// insertCheckin — upsert logic
// ---------------------------------------------------------------------------
export function insertCheckin(data) {
  loadData();
  const existingIndex = checkins.findIndex((c) => c.id === data.id);

  if (existingIndex >= 0) {
    const existing = checkins[existingIndex];
    checkins[existingIndex] = {
      ...existing,
      property: data.property ?? existing.property,
      bed_id: data.bed_id ?? existing.bed_id,
      rating: data.rating ?? existing.rating,
      tags: data.tags ?? existing.tags,
      raw_note: data.raw_note ?? existing.raw_note,
      generated_review: data.generated_review ?? existing.generated_review,
      scan_started: Math.max(Number(data.scan_started ?? 0), Number(existing.scan_started ?? 0)),
      copied_google_link: Math.max(Number(data.copied_google_link ?? 0), Number(existing.copied_google_link ?? 0)),
      joined_community: Math.max(Number(data.joined_community ?? 0), Number(existing.joined_community ?? 0)),
    };
  } else {
    checkins.push({
      id: data.id,
      property: data.property ?? null,
      bed_id: data.bed_id ?? null,
      rating: data.rating ?? null,
      tags: data.tags ?? '[]',
      raw_note: data.raw_note ?? null,
      generated_review: data.generated_review ?? null,
      scan_started: Number(data.scan_started ?? 0),
      copied_google_link: Number(data.copied_google_link ?? 0),
      joined_community: Number(data.joined_community ?? 0),
      created_at: data.created_at ?? new Date().toISOString(),
    });
  }

  saveData();
}

// ---------------------------------------------------------------------------
// updateCheckinFlag
// ---------------------------------------------------------------------------
const ALLOWED_FLAGS = new Set(['scan_started', 'copied_google_link', 'joined_community']);

export function updateCheckinFlag(id, flag, value) {
  if (!ALLOWED_FLAGS.has(flag)) {
    throw new Error(`Invalid flag: ${flag}`);
  }
  loadData();
  const item = checkins.find((c) => c.id === id);
  if (item) {
    item[flag] = Number(value);
    saveData();
  }
}

// ---------------------------------------------------------------------------
// getMetrics
// ---------------------------------------------------------------------------
export function getMetrics() {
  loadData();

  let totalScans = 0;
  let totalCheckins = 0;
  let reviewClicks = 0;
  let communityJoins = 0;

  const bedMap = {};
  const tagMap = {};

  for (const c of checkins) {
    if (c.scan_started === 1) totalScans++;
    if (c.rating !== null && c.rating !== undefined) totalCheckins++;
    if (c.copied_google_link === 1) reviewClicks++;
    if (c.joined_community === 1) communityJoins++;

    // Group by Bed
    const bedKey = c.bed_id || 'UNKNOWN';
    if (!bedMap[bedKey]) {
      bedMap[bedKey] = {
        bed_id: bedKey,
        scans: 0,
        checkins: 0,
        reviewClicks: 0,
        communityJoins: 0,
      };
    }
    if (c.scan_started === 1) bedMap[bedKey].scans++;
    if (c.rating !== null && c.rating !== undefined) bedMap[bedKey].checkins++;
    if (c.copied_google_link === 1) bedMap[bedKey].reviewClicks++;
    if (c.joined_community === 1) bedMap[bedKey].communityJoins++;

    // Aggregate tags
    if (c.tags) {
      try {
        const parsed = typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags;
        if (Array.isArray(parsed)) {
          for (const t of parsed) {
            tagMap[t] = (tagMap[t] ?? 0) + 1;
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }

  const byBed = Object.values(bedMap).sort((a, b) => b.scans - a.scans);
  const byTag = Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const recentCheckins = [...checkins]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 20);

  return {
    totalScans,
    totalCheckins,
    reviewClicks,
    communityJoins,
    byBed,
    byTag,
    recentCheckins,
  };
}

// ---------------------------------------------------------------------------
// getAllCheckins
// ---------------------------------------------------------------------------
export function getAllCheckins() {
  loadData();
  return [...checkins].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}
