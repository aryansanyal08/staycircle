export const BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

/**
 * Submit a guest check-in form.
 * @param {{ name: string, bed: string, property: string, sessionId: string, ratings: object }} payload
 * @returns {Promise<{ reviewText: string, googleUrl: string, passId: string }>}
 */
export async function submitCheckin(payload) {
  const res = await fetch(`${BASE}/api/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Checkin failed')
  return res.json()
}

/**
 * Fire-and-forget analytics event tracker.
 * @param {string} id  - session / pass ID
 * @param {string} event - event name e.g. 'scan_started', 'review_copied'
 */
export async function trackEvent(id, event) {
  try {
    await fetch(`${BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, event }),
    })
  } catch (e) {
    // non-blocking — analytics must never break the UX
  }
}

/**
 * Fetch aggregated metrics for the admin dashboard.
 * @returns {Promise<object>}
 */
export async function fetchMetrics() {
  const res = await fetch(`${BASE}/api/metrics`)
  return res.json()
}

/**
 * Generate QR code(s) for a given bed / property combination.
 * @param {{ property: string, beds: string[] }} payload
 * @returns {Promise<{ qrs: Array<{ bed: string, dataUrl: string }> }>}
 */
export async function generateQRCodes(payload) {
  const res = await fetch(`${BASE}/api/qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
