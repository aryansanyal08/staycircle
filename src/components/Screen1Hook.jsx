import React from 'react';

const PERKS = [
  {
    icon: '🗺️',
    title: 'Live Trek & Cafe Buddies',
    desc: 'Find travel companions in real-time',
  },
  {
    icon: '🗺️',
    title: 'Secret Local Map',
    desc: 'Hidden gems only hostel guests know',
  },
  {
    icon: '🎉',
    title: 'Nightly Hostel Events',
    desc: "Never miss tonight's gathering",
  },
];

const AVATARS = [
  { initials: 'RK', color: 'bg-rose-500' },
  { initials: 'PG', color: 'bg-violet-500' },
  { initials: 'AM', color: 'bg-blue-500' },
  { initials: 'SK', color: 'bg-amber-500' },
];

export default function Screen1Hook({ bed, property, onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">

          {/* Property badge */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/30 tracking-wide uppercase">
              🏠 {property || 'StayCircle'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
            Join the Verified Hostel<br />
            <span className="text-green-400">Travelers & Trekking Circle</span>
          </h1>

          {/* Subline */}
          <p className="text-green-400 font-semibold text-sm mb-6 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            450+ Guests Already Inside
          </p>

          {/* Perks */}
          <ul className="space-y-3 mb-7">
            {PERKS.map((perk) => (
              <li
                key={perk.title}
                className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
              >
                <span className="text-xl mt-0.5 leading-none">{perk.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug">
                    {perk.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{perk.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex -space-x-2">
              {AVATARS.map((av) => (
                <div
                  key={av.initials}
                  className={`w-8 h-8 rounded-full ${av.color} border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-sm">
              <span className="text-white font-semibold">Rahul, Priya</span>
              {' '}
              &amp; 448 others joined this week
            </p>
          </div>

          {/* CTA button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-xl shadow-lg shadow-green-900/40 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Continue to 10-Sec Check-In
            <span className="text-lg">→</span>
          </button>

          {/* Fine print */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Takes 10 seconds. No login required.
          </p>
        </div>

        {/* Bed info outside card */}
        {bed && (
          <p className="text-center text-gray-600 text-xs mt-4">
            Bed: <span className="text-gray-400 font-mono">{bed}</span>
          </p>
        )}
      </div>
    </div>
  );
}
