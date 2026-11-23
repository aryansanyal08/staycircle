import 'dotenv/config';

// ---------------------------------------------------------------------------
// Tag → readable phrase mapping
// ---------------------------------------------------------------------------
const TAG_PHRASES = {
  // Screen2 canonical tags
  '🔥 Social Vibe': 'the social atmosphere',
  '🛏️ Clean Dorms': 'the clean dorms',
  '🙌 Friendly Staff': 'the friendly staff',
  '📶 Fast Wi-Fi': 'the fast Wi-Fi',
  '📍 Great Location': 'the great location',
  '🛠️ Needs Improvement': 'areas that need improvement',
  // Legacy / extended tags
  '📶 Fast WiFi': 'the fast WiFi',
  '🍳 Great Kitchen': 'the great kitchen',
  '🗺️ Perfect Location': 'the perfect location',
  '🔒 Safe & Secure': 'the safety and security',
  '👥 Helpful Staff': 'the helpful staff',
  '🎉 Fun Events': 'the fun events',
  '🚿 Clean Bathrooms': 'the clean bathrooms',
  '🌙 Quiet Nights': 'the quiet nights',
  '🎒 Storage': 'the ample storage',
  '☕ Common Area': 'the cosy common area',
};

function tagToPhrase(tag) {
  return TAG_PHRASES[tag] ?? tag;
}

// ---------------------------------------------------------------------------
// Deterministic fallback
// ---------------------------------------------------------------------------
function deterministicReview(rating, tags, note) {
  const phrases = tags.map(tagToPhrase);
  const h1 = phrases[0] ?? 'the overall experience';
  const h2 = phrases[1] ?? 'the amenities';

  const templates = {
    5: `Absolutely loved it! ${capitalise(h1)} and ${h2} made this stay unforgettable. Would come back in a heartbeat.`,
    4: `Really solid hostel experience. ${capitalise(h1)} stood out, and ${h2} was a nice touch. Recommended for travelers.`,
    3: `Decent stay overall. ${capitalise(h1)} was good, though there's room for improvement in a few areas. Fair value for the price.`,
    2: `Mixed experience here. ${capitalise(h1)} was okay but ${h2} needed more attention. Might not return unless things improve.`,
    1: `Unfortunately didn't meet expectations. ${capitalise(h1)} was a concern throughout the stay. Hope management addresses these issues.`,
  };

  const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));
  let review = templates[clampedRating] ?? templates[3];

  if (note && note.trim()) {
    review += ` One thing to note: ${note.trim()}`;
  }

  return review;
}

function capitalise(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------------------------------------------------------------------
// Tone variations
// ---------------------------------------------------------------------------
const TONE_VARIATIONS = ['casual backpacker', 'thoughtful traveler', 'brief and direct'];

function pickTone() {
  return TONE_VARIATIONS[Math.floor(Math.random() * TONE_VARIATIONS.length)];
}

// ---------------------------------------------------------------------------
// Gemini API call
// ---------------------------------------------------------------------------
async function callGemini(rating, tags, note) {
  const apiKey = process.env.LLM_API_KEY;
  const tone = pickTone();
  const tagList = tags.join(', ') || 'none';
  const noteText = note && note.trim() ? note.trim() : 'none';

  const prompt = `You are a real hostel guest writing a Google review. Write a natural, authentic 2-3 sentence review based on:
Rating: ${rating}/5
Highlights: ${tagList}
Personal note: ${noteText}

Rules:
- Never fake positivity for low ratings. If rating is 1-2, acknowledge the issues honestly.
- Sound like a real traveler, not marketing copy.
- Vary sentence structure. No bullet points.
- 2-3 sentences max.
- Tone variation: ${tone}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned empty content');
  }

  return text.trim();
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export async function generateReview(rating, tags, note) {
  if (process.env.LLM_API_KEY) {
    try {
      const review = await callGemini(rating, tags, note);
      return review;
    } catch (err) {
      console.warn('[llm] Gemini call failed, using deterministic fallback:', err.message);
    }
  }

  return deterministicReview(rating, tags, note);
}
