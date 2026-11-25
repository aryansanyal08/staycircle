import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '..', 'staycircle.json');

const PROPERTY = 'Sai Ganga Cottage';

const REVIEWS = [
  {
    bed_id: 'B1',
    rating: 5,
    tags: ['🔥 Social Vibe', '📍 Great Location', '🙌 Friendly Staff'],
    raw_note: 'Loved the morning chai by the Ganga and evening jam session on the terrace.',
    generated_review:
      'Stayed at Sai Ganga Cottage in Rishikesh and honestly did not want to leave. The location near the river is peaceful, the staff feels like family, and the evening social vibe on the terrace made it super easy to meet fellow travelers.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 2,
  },
  {
    bed_id: 'D1',
    rating: 5,
    tags: ['🛏️ Clean Dorms', '📶 Fast Wi-Fi'],
    raw_note: 'Worked remotely for 4 days, zero Wi-Fi drops and super clean beds.',
    generated_review:
      'Great spot for digital nomads in Rishikesh! Fast and reliable Wi-Fi throughout my workation, spotless dorms, and a calm atmosphere during the day. Highly recommend Sai Ganga Cottage.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 5,
  },
  {
    bed_id: 'Room-101',
    rating: 4,
    tags: ['📍 Great Location', '🙌 Friendly Staff'],
    raw_note: 'Walking distance to Laxman Jhula cafes, staff helped us book rafting.',
    generated_review:
      'Awesome location right near all the best cafes and yoga spots in Rishikesh. The hosts at Sai Ganga Cottage were super helpful with local tips and river rafting bookings.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 9,
  },
  {
    bed_id: 'B3',
    rating: 5,
    tags: ['🔥 Social Vibe', '🛏️ Clean Dorms'],
    raw_note: 'Met 5 solo travelers on day one, we all went to Ganga Aarti together.',
    generated_review:
      'Best solo-traveler vibe at Sai Ganga Cottage! Clean dorms, cozy common area, and I instantly found a crew to explore Rishikesh and attend the evening Ganga Aarti with.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 14,
  },
  {
    bed_id: 'Cafe-T1',
    rating: 4,
    tags: ['📶 Fast Wi-Fi', '🔥 Social Vibe'],
    raw_note: 'Cafe coffee and mountain breeze are unbeatable.',
    generated_review:
      'Spent most of my afternoons working from the cafe area at Sai Ganga Cottage. Great coffee, strong Wi-Fi, and a super welcoming crowd of travelers and remote workers.',
    copied_google_link: 0,
    joined_community: 1,
    hoursAgo: 19,
  },
  {
    bed_id: 'B2',
    rating: 5,
    tags: ['🙌 Friendly Staff', '🛏️ Clean Dorms', '📍 Great Location'],
    raw_note: null,
    generated_review:
      'Wonderful stay at Sai Ganga Cottage! Everything from check-in to checkout was effortless. Clean rooms, warm hospitality, and an unbeatable location in Rishikesh.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 25,
  },
  {
    bed_id: 'D2',
    rating: 3,
    tags: ['📍 Great Location', '🛠️ Needs Improvement'],
    raw_note: 'Great location and vibe, though hot water took a couple minutes in the morning.',
    generated_review:
      'Loved the location and friendly community at Sai Ganga Cottage. The rooms are comfortable, though the morning hot water took a little while to heat up. Overall a solid budget stay in Rishikesh.',
    copied_google_link: 0,
    joined_community: 1,
    hoursAgo: 31,
  },
  {
    bed_id: 'B4',
    rating: 5,
    tags: ['🔥 Social Vibe', '🙌 Friendly Staff'],
    raw_note: 'Bonfire night and acoustic guitar made my trip.',
    generated_review:
      'Unforgettable nights at Sai Ganga Cottage! The bonfire and acoustic jam sessions brought everyone together, and the staff goes out of their way to make you feel at home.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 38,
  },
  {
    bed_id: 'Room-102',
    rating: 4,
    tags: ['🛏️ Clean Dorms', '📍 Great Location'],
    raw_note: 'Peaceful sleep, very clean linens.',
    generated_review:
      'Very clean and peaceful private room at Sai Ganga Cottage. Close enough to the buzz of Rishikesh while still giving you a quiet night of sleep.',
    copied_google_link: 0,
    joined_community: 0,
    hoursAgo: 44,
  },
  {
    bed_id: 'B5',
    rating: 5,
    tags: ['📶 Fast Wi-Fi', '🙌 Friendly Staff', '🔥 Social Vibe'],
    raw_note: 'Extended my 2-night booking to a full week!',
    generated_review:
      'Came to Sai Ganga Cottage for two nights and ended up staying a whole week. Fast Wi-Fi for calls, genuinely kind staff, and an amazing community of travelers.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 52,
  },
  {
    bed_id: 'B1',
    rating: 4,
    tags: ['🔥 Social Vibe', '📍 Great Location'],
    raw_note: 'Easy walk to the river beach.',
    generated_review:
      'Super convenient location just a short walk from the Ganga. Great social energy in the evenings without getting too loud at night.',
    copied_google_link: 0,
    joined_community: 1,
    hoursAgo: 61,
  },
  {
    bed_id: 'D1',
    rating: 5,
    tags: ['🛏️ Clean Dorms', '🙌 Friendly Staff'],
    raw_note: 'Lockers are spacious and beds have curtains + reading lights.',
    generated_review:
      'Thoughtfully designed dorms at Sai Ganga Cottage—big lockers, privacy curtains, and bedside lights. Everything is kept spotless by the super attentive staff.',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 70,
  },
  {
    bed_id: 'Cafe-T1',
    rating: 3,
    tags: ['📶 Fast Wi-Fi', '🛠️ Needs Improvement'],
    raw_note: 'Wi-Fi is fast, wish the cafe stayed open a bit later past 10pm.',
    generated_review:
      'Good Wi-Fi and cozy hangout space at Sai Ganga Cottage. Would love if the cafe stayed open a bit later at night, but otherwise a very pleasant stay.',
    copied_google_link: 0,
    joined_community: 0,
    hoursAgo: 78,
  },
  {
    bed_id: 'B3',
    rating: 4,
    tags: ['🙌 Friendly Staff', '🔥 Social Vibe'],
    raw_note: 'Hosts organized a sunrise trek to Kunjapuri Temple.',
    generated_review:
      'The hosts at Sai Ganga Cottage organized an incredible sunrise trip to Kunjapuri Temple for everyone staying here. Best way to experience Rishikesh with new friends!',
    copied_google_link: 1,
    joined_community: 1,
    hoursAgo: 86,
  },
  {
    bed_id: 'Room-101',
    rating: 5,
    tags: ['📍 Great Location', '🛏️ Clean Dorms', '📶 Fast Wi-Fi'],
    raw_note: null,
    generated_review:
      'Clean, comfortable, and right in the heart of Rishikesh. Sai Ganga Cottage nailed the balance between peaceful retreat and social hostel.',
    copied_google_link: 0,
    joined_community: 1,
    hoursAgo: 94,
  },
  {
    bed_id: 'B2',
    rating: 2,
    tags: ['📍 Great Location', '🛠️ Needs Improvement'],
    raw_note: 'Great location but street noise from scooters in the afternoon.',
    generated_review:
      'Location at Sai Ganga Cottage is convenient for exploring Rishikesh, though there was some street noise during the afternoon. Staff was polite and responsive.',
    copied_google_link: 0,
    joined_community: 0,
    hoursAgo: 103,
  },
  {
    bed_id: 'D2',
    rating: 4,
    tags: ['🔥 Social Vibe', '🛏️ Clean Dorms'],
    raw_note: 'Great value for money in Tapovan/Rishikesh.',
    generated_review:
      'Really good value for money at Sai Ganga Cottage. Clean dorms, friendly travelers, and a laid-back Rishikesh atmosphere.',
    copied_google_link: 0,
    joined_community: 0,
    hoursAgo: 112,
  },
];

// 7 scan-only stubs (scanned QR, didn't finish check-in) -> 17 + 7 = 24 total QR scans
const SCAN_STUBS = [
  { bed_id: 'B1', hoursAgo: 1 },
  { bed_id: 'B4', hoursAgo: 11 },
  { bed_id: 'Cafe-T1', hoursAgo: 22 },
  { bed_id: 'D1', hoursAgo: 35 },
  { bed_id: 'Room-102', hoursAgo: 49 },
  { bed_id: 'B5', hoursAgo: 67 },
  { bed_id: 'B2', hoursAgo: 90 },
];

const now = Date.now();

const records = [
  ...REVIEWS.map((r) => ({
    id: randomUUID(),
    property: PROPERTY,
    bed_id: r.bed_id,
    rating: r.rating,
    tags: JSON.stringify(r.tags),
    raw_note: r.raw_note,
    generated_review: r.generated_review,
    scan_started: 1,
    copied_google_link: r.copied_google_link,
    joined_community: r.joined_community,
    created_at: new Date(now - r.hoursAgo * 3600 * 1000).toISOString(),
  })),
  ...SCAN_STUBS.map((s) => ({
    id: randomUUID(),
    property: PROPERTY,
    bed_id: s.bed_id,
    rating: null,
    tags: '[]',
    raw_note: null,
    generated_review: null,
    scan_started: 1,
    copied_google_link: 0,
    joined_community: 0,
    created_at: new Date(now - s.hoursAgo * 3600 * 1000).toISOString(),
  })),
];

// Sort newest first
records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2), 'utf-8');

const scans = records.filter((r) => r.scan_started === 1).length;
const checkins = records.filter((r) => r.rating !== null).length;
const clicks = records.filter((r) => r.copied_google_link === 1).length;
const joins = records.filter((r) => r.joined_community === 1).length;

console.log(`Seeded ${DB_PATH}`);
console.log(`  Total QR Scans:     ${scans}`);
console.log(`  Completed Reviews:  ${checkins}`);
console.log(`  Google Link Clicks: ${clicks}`);
console.log(`  Community Joins:    ${joins}`);
