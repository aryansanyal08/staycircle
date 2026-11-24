import React from 'react';

export default function Screen1Hook({ bed, property, onContinue }) {
  const stayName = property || 'Sai Ganga Cottage';

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 screen-enter max-w-md mx-auto">
      
      {/* ── Top Bar (Like reference brand header) ── */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-base shadow-sm">
            🏕️
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>StayCircle</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-semibold border border-orange-500/30">PASS</span>
            </div>
          </div>
        </div>

        {/* User / Bed Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#161b22] border border-white/10 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">{bed && bed !== 'WALK-IN' ? `Bed ${bed}` : 'Hostel Guest'}</span>
          </div>
        </div>
      </div>

      {/* ── Headline Block (Editorial Serif style from reference) ── */}
      <div className="mb-5 px-1">
        <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-2">
          Boutique Hostels &amp; Digital Nomad Circle
        </p>
        <h1 className="font-display text-2xl sm:text-[28px] font-bold text-white leading-[1.25] tracking-tight">
          Find your crowd. Discover experiences that match your rhythm.
        </h1>
      </div>

      {/* ── Hero Stay Card (Exact aesthetic of the Alpine Hub card in image) ── */}
      <div className="cinema-card relative mb-5 group">
        {/* Card Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" 
            alt="Cottage and Mountains" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-[#111418]/40 to-transparent"></div>

          {/* Top Rating Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1 shadow-lg">
            <span className="text-amber-400">★</span> 4.9 <span className="text-slate-400 font-normal">(450+ guests)</span>
          </div>

          {/* Floating Category Pill */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange-600/90 text-white text-[10px] font-bold tracking-wide uppercase shadow">
            Verified Stay
          </div>

          {/* Bottom Title inside Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {stayName} • Rishikesh
            </h2>
            <p className="text-xs text-slate-300 font-medium drop-shadow">
              River View • Social Hostel • Fast Wi-Fi
            </p>
          </div>
        </div>

        {/* Card Body & Perks */}
        <div className="p-4 space-y-3">
          
          {/* 3 Interactive Vibe Pills */}
          <div className="flex flex-wrap gap-1.5">
            <span className="cinema-pill px-2.5 py-1 text-[11px]">
              ☕ Rooftop Cafe
            </span>
            <span className="cinema-pill px-2.5 py-1 text-[11px]">
              🧘 Morning Yoga
            </span>
            <span className="cinema-pill px-2.5 py-1 text-[11px]">
              🔥 Evening Bonfire
            </span>
            <span className="cinema-pill px-2.5 py-1 text-[11px]">
              📶 120 Mbps Wi-Fi
            </span>
          </div>

          {/* What's Your Vibe Mini Subcard */}
          <div className="cinema-subcard p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg">
                👥
              </div>
              <div>
                <div className="text-xs font-bold text-white">Hostel Travelers Circle</div>
                <div className="text-[11px] text-slate-400">87 travelers checked in this week</div>
              </div>
            </div>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

        </div>
      </div>

      {/* ── Community Events Preview Pill ── */}
      <div className="cinema-subcard p-3 flex items-center justify-between mb-4 border border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="text-base">📅</span>
          <div>
            <div className="text-xs font-bold text-white">Tonight: Acoustic Music &amp; Ganga Jam</div>
            <div className="text-[10px] text-slate-400">Rooftop Lounge • 8:30 PM</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Free Pass</span>
      </div>

      {/* ── Primary Action Button ── */}
      <div className="space-y-2">
        <button
          onClick={onContinue}
          className="btn-cinema-primary w-full py-4 px-6 text-sm flex items-center justify-center gap-2 group"
        >
          <span>Continue to 10-Sec Check-In</span>
          <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Takes 10 seconds • No signup • Unlocks WhatsApp Group &amp; Secret Map
        </p>
      </div>

    </div>
  );
}
