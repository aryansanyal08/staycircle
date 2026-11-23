# StayCircle 🏨

StayCircle is a **Hostel Community Pass & 1-Tap Google Review Helper** web app. Guests scan a QR sticker on their bunk, check in with their name, unlock WhatsApp community access and discount perks, and optionally post an AI-ghostwritten Google review — all in under 60 seconds.

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/your-org/staycircle.git
cd staycircle
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in the variables (see table below)

# 3. Run (client on :5173, API on :3001)
npm run dev
```

Open [http://localhost:5173/?bed=DORM-A04&property=goSTOPS](http://localhost:5173/?bed=DORM-A04&property=goSTOPS) to see the full guest flow.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GOOGLE_REVIEW_URL` | ✅ | Google Business Profile "Write a Review" URL. Get it from your [Google Business Profile](https://business.google.com) → Get more reviews. |
| `VITE_COMMUNITY_URL` | ✅ | WhatsApp community / group invite link shown after check-in. |
| `LLM_API_KEY` | ⚠️ Optional | Gemini API key for the AI review ghostwriter. If absent, a deterministic fallback template is used. |
| `DATABASE_URL` | ⚠️ Optional | PostgreSQL connection string. If absent, a local SQLite file (`staycircle.db`) is used automatically. |
| `PORT` | ⚠️ Optional | Port the Express server listens on. Defaults to `3001`. |
| `ADMIN_PASSWORD` | ⚠️ Optional | Password to protect the `/admin` dashboard. Leave blank to disable auth (not recommended in production). |

---

## Deploy

### Render.com (recommended)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `node server/index.js`
5. Add all environment variables from the table above in the Render dashboard.
6. Done — Render provisions a free TLS certificate automatically.

### Railway

1. `railway init` inside the project directory.
2. `railway up` — Railway auto-detects Node and runs `npm start`.
3. Add env vars via `railway variables set KEY=value` or the Railway dashboard.

> [!TIP]
> For production, set `DATABASE_URL` to a managed PostgreSQL instance (Render Postgres, Railway Postgres, or Neon) so data persists across deploys.

---

## Admin Dashboard

Navigate to **`/admin`** (e.g. `https://your-app.onrender.com/admin`) to view:

- Total check-ins per property and bed
- Review click-through rate
- WhatsApp community join rate
- Recent check-in log

If `ADMIN_PASSWORD` is set, you will be prompted for it on first visit.

---

## QR Sticker Generation

Generate print-ready QR codes for each bunk using the built-in API:

```bash
# Single sticker (returns PNG)
curl "http://localhost:3001/api/qr?bed=DORM-A04&property=goSTOPS" --output sticker-A04.png

# Or open in browser for a preview
open "http://localhost:3001/api/qr?bed=DORM-A04&property=goSTOPS"
```

**Batch generation tip:** Create a simple shell loop:

```bash
for bed in A01 A02 A03 A04 B01 B02 B03 B04; do
  curl -s "http://localhost:3001/api/qr?bed=DORM-$bed&property=goSTOPS" \
       --output "stickers/sticker-$bed.png"
  echo "Generated sticker-$bed.png"
done
```

Print the PNGs at **5 × 5 cm** on sticker paper and affix to the bunk headboard or locker. The QR encodes a URL in the form:

```
https://your-app.onrender.com/?bed=DORM-A04&property=goSTOPS
```

---

## Project Structure

```
staycircle/
├── src/                  # React frontend (Vite + Tailwind)
│   ├── components/       # Screen1Hook, Screen2Checkin, Screen3Unlock, AdminDashboard
│   └── lib/api.js        # Typed fetch wrappers for the Express API
└── server/               # Express backend
    ├── index.js          # App entry, middleware, route mounting
    ├── db.js             # SQLite / PostgreSQL abstraction
    ├── llm.js            # Gemini ghostwriter + deterministic fallback
    └── routes/           # checkin, track, metrics, qr
```

---

## License

MIT © StayCircle Contributors
