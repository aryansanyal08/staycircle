import React from 'react';

export default function Screen1Hook({ bed, property, onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 screen-enter">
      <div className="w-full max-w-md space-y-5">

        {/* ── Property Badge ── */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(249,115,22,0.2)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.35)' }}>
            🌴 {property || 'Hostel'}
          </span>
        </div>

        {/* ── Main Card ── */}
        <div className="trop-card p-6">

          {/* Headline */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🏝️</div>
            <h1 className="text-2xl font-extrabold text-white leading-tight mb-2">
              Join the Verified Hostel<br />
              <span style={{ color: '#99f6e4' }}>Travelers & Trekking Circle</span>
            </h1>
            <p className="text-sm font-semibold" style={{ color: '#fb923c' }}>
              🔥 450+ Guests Already Inside
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3 mb-6">
            {[
              { icon: '🧭', title: 'Live Trek & Cafe Buddies', desc: 'Find travel companions in real-time' },
              { icon: '🗺️', title: 'Secret Local Map',         desc: 'Hidden gems only hostel guests know' },
              { icon: '🎉', title: 'Nightly Hostel Events',    desc: "Never miss tonight's gathering" },
            ].map((p) => (
              <div key={p.title} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="text-white text-sm font-bold">{p.title}</div>
                  <div className="text-xs" style={{ color: '#99f6e4' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="flex -space-x-2">
              {[['R','#f97316'],['P','#0d9488'],['A','#8b5cf6'],['K','#ec4899']].map(([l,c]) => (
                <div key={l} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2"
                  style={{ background: c, ringColor: '#042f2e' }}>{l}</div>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span className="text-white font-semibold">Rahul, Priya</span> & 448 others joined this week
            </p>
          </div>

          {/* CTA */}
          <button onClick={onContinue}
            className="btn-coral w-full py-4 text-base flex items-center justify-center gap-2">
            🌊 Continue to 10-Sec Check-In →
          </button>

          <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Takes 10 seconds · No login required
          </p>
        </div>

        {/* Bed Info */}
        {bed && bed !== 'WALK-IN' && (
          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            🛏️ Detected bed: <span className="font-semibold text-white">{bed}</span>
          </p>
        )}
      </div>
    </div>
  );
}
