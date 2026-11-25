import React, { useState } from 'react'

const HOTELS = [
  {
    id: 1,
    name: 'Sai Ganga Cottage',
    location: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    rating: 4.0,
    reviews: 340,
    price: '₹1,499',
    tags: ['River View', 'Yoga Deck', 'Community Jam'],
    vibe: 'Nature & Wellness',
    badge: null,
    featured: true,
  },
  {
    id: 2,
    name: 'Rooftop Café & Co-living',
    location: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    rating: 4.8,
    reviews: 210,
    price: '₹1,200',
    tags: ['Rooftop Views', 'Work & Café'],
    vibe: 'Urban Co-living',
    badge: null,
    featured: false,
  },
  {
    id: 3,
    name: 'The Forest Nest',
    location: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    rating: 4.9,
    reviews: 178,
    price: '₹1,850',
    tags: ['Nature & Yoga', 'Eco Stay'],
    vibe: 'Forest Retreat',
    badge: null,
    featured: false,
  },
]

const VIBES = ['Workation 💻', 'Social Hostel 🎉', 'Rooftop Views 🌅', 'Mountain Retreats ⛰️', 'Eco-Glamping 🌿', 'Pet Friendly 🐾']
const NAV = ['Explore', 'Vibes', 'Community', 'Workations']

export default function LandingPage({ onEnterFlow }) {
  const [activeVibe, setActiveVibe] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [hovered, setHovered] = useState(null)

  return (
    <div className="landing-page min-h-screen" style={{ background: '#080a0d', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-sm sticky top-0 z-50" style={{ background: 'rgba(8,10,13,0.9)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
            SC
          </div>
          <span className="text-white font-bold text-lg tracking-tight">StayCircle</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map(n => (
            <a key={n} href="#" className="text-sm font-medium transition-colors" style={{ color: '#94a3b8' }}
              onMouseEnter={e => e.target.style.color = '#f1f5f9'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              {n}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#1a1f27', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>A</div>
            <span className="text-sm font-medium text-white">Aryan</span>
          </div>
          <button
            onClick={onEnterFlow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
            + Host
          </button>
        </div>
      </nav>

      {/* ── HERO SEARCH ── */}
      <div className="px-8 pt-12 pb-6 max-w-6xl mx-auto">

        {/* Search bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl mb-5" style={{ background: '#111418', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)' }}>
          {/* Where */}
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl cursor-text" style={{ background: '#161b22' }}>
            <span style={{ color: '#ea580c' }}>📍</span>
            <input
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: '#f1f5f9' }}
              placeholder="Where to?"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />

          {/* Check in/out */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: '#161b22' }}>
            <span style={{ color: '#94a3b8' }}>📅</span>
            <span className="text-sm" style={{ color: '#94a3b8' }}>Check-in / Check-out</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />

          {/* Guests */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: '#161b22' }}>
            <span style={{ color: '#94a3b8' }}>👥</span>
            <span className="text-sm" style={{ color: '#94a3b8' }}>Guests</span>
          </div>

          {/* Vibe Filter */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer" style={{ background: '#161b22' }}>
            <span style={{ color: '#94a3b8' }}>🎨</span>
            <span className="text-sm" style={{ color: '#94a3b8' }}>Vibe Filters</span>
            <span style={{ color: '#94a3b8' }}>▾</span>
          </div>

          {/* Search button */}
          <button className="btn-cinema-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
            🔍
          </button>
        </div>

        {/* Vibe pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {VIBES.map(v => (
            <button
              key={v}
              onClick={() => setActiveVibe(activeVibe === v ? null : v)}
              className={`cinema-pill px-4 py-2 text-xs font-semibold transition-all ${activeVibe === v ? 'cinema-pill-active' : ''}`}>
              {v}
            </button>
          ))}
        </div>

        {/* ── HERO HEADLINE ── */}
        <div className="mb-4">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#ea580c' }}>
            BOUTIQUE HOSTELS &amp; STAYS FOR DIGITAL NOMADS
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-white mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            Find your crowd.<br />Discover stays<br />that match your rhythm.
          </h1>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* Featured card — large */}
          <div
            className="col-span-12 md:col-span-5 relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: 320 }}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onEnterFlow && onEnterFlow()}
          >
            <img
              src={HOTELS[0].image}
              alt={HOTELS[0].name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ minHeight: 320 }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />

            {/* Rating badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fbbf24' }}>
              ⭐ {HOTELS[0].rating} ({HOTELS[0].reviews}+ reviews)
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl font-bold text-white mb-0.5">{HOTELS[0].name} • {HOTELS[0].location}</h3>
              <p className="text-xs mb-3" style={{ color: '#94a3b8' }}>{HOTELS[0].vibe} • Fast Wi-Fi</p>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {HOTELS[0].tags.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: '#fb923c' }}>From {HOTELS[0].price}/night</span>
                <button
                  onClick={e => { e.stopPropagation(); onEnterFlow && onEnterFlow() }}
                  className="btn-cinema-primary px-4 py-2 text-xs rounded-xl font-bold"
                >
                  Check In →
                </button>
              </div>
            </div>
          </div>

          {/* Right column — 2 smaller + 2 side widgets */}
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">

            {/* Card 2 */}
            {HOTELS.slice(1).map((h, i) => (
              <div key={h.id} className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ minHeight: 160 }}>
                <img src={h.image} alt={h.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ minHeight: 160 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fbbf24' }}>
                  ⭐ {h.rating}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{h.name}</p>
                      <p className="text-xs" style={{ color: '#94a3b8' }}>{h.location}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#fb923c' }}>{h.price}/night</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {h.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Vibe Widget */}
            <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #1a1f2e, #111418)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 160 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🌊</span>
                <span className="text-sm font-bold text-white">What's your vibe today?</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {['Chill 🌙', 'Social 🎉', 'Quiet 🤫', 'Trekking 🏔️', 'Rooftop 🌅'].map(v => (
                  <button key={v} className="text-xs px-2 py-1.5 rounded-lg font-medium text-left transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Widget */}
            <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0f1a1a, #111418)', border: '1px solid rgba(20,184,166,0.15)', minHeight: 160 }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📅</span>
                  <span className="text-xs font-bold" style={{ color: '#14b8a6' }}>Community Events</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Thursday Rooftop Jam · 7 PM</p>
                <p className="text-xs" style={{ color: '#64748b' }}>Sai Ganga Cottage, Rishikesh</p>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#10b981' }}>
                  <span>📈</span>
                  <span className="font-semibold">Trending: 87 digital nomads checked in this week</span>
                </div>
              </div>
              <button
                onClick={onEnterFlow}
                className="mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', color: '#14b8a6' }}>
                Join Community Pass →
              </button>
            </div>

          </div>
        </div>

        {/* ── BOTTOM STATS BAR ── */}
        <div className="mt-8 flex items-center justify-between px-6 py-4 rounded-2xl" style={{ background: '#111418', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Hostels Listed', value: '340+', icon: '🏨' },
            { label: 'Digital Nomads', value: '12K+', icon: '🌍' },
            { label: 'Cities', value: '28', icon: '📍' },
            { label: 'Avg Rating', value: '4.7 ⭐', icon: '✨' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs" style={{ color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
          <button
            onClick={onEnterFlow}
            className="btn-cinema-primary px-6 py-3 rounded-xl font-bold text-sm"
          >
            Scan QR & Check In ↗
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-8 pb-8 text-center">
          <p className="text-xs" style={{ color: '#374151' }}>© 2024 StayCircle · Built for wanderers by wanderers</p>
        </div>
      </div>
    </div>
  )
}
