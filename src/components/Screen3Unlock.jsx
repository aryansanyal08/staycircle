import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../lib/api';

const REVIEW_VARIANTS = {
  1: [
    "Unfortunately, the stay at Sai Ganga Cottage fell short of expectations. The amenities needed more maintenance and attention. Hoping management resolves these issues for future travelers.",
    "Found the stay lacking in basic facilities and hygiene standards. The location has potential, but the property needs urgent upgrades before I could recommend it.",
  ],
  2: [
    "Mixed feelings about our stay. The mountain air and location were great, but certain amenities and room cleanliness could definitely be polished. Fair for budget travelers.",
    "Decent stay for a quick stopover, but expected a bit more care with the rooms and service. Hopefully they implement improvements soon.",
  ],
  3: [
    "Pleasant stay overall at Sai Ganga Cottage! The peaceful atmosphere and river proximity were highlights. A few minor things could be improved, but good value for money.",
    "Good, comfortable stay in Rishikesh. Helpful staff and cozy common spots. Enjoyed the overall traveler energy here.",
  ],
  4: [
    "Loved our time at Sai Ganga Cottage! Incredible location, spotless rooms, and such warm hospitality. Met wonderful fellow travelers during the evening jam sessions. Highly recommended!",
    "Really great stay in Rishikesh. Peaceful atmosphere, fast Wi-Fi for remote work, and stunning views. Will definitely visit again!",
  ],
  5: [
    "Absolutely unforgettable stay at Sai Ganga Cottage! 🌟 Pristine mountain tranquility, super welcoming hosts, fast Wi-Fi, and an unbeatable traveler community. Best stay experience in Rishikesh!",
    "10/10 stay! The vibe, the hospitality, and the travelers community here are extraordinary. Waking up to the fresh mountain breeze made this trip so special. Highly recommended to everyone! ⭐⭐⭐⭐⭐",
  ],
};

function getVariants(rating) {
  const key = Math.min(5, Math.max(1, Math.round(rating || 5)));
  return REVIEW_VARIANTS[key] || REVIEW_VARIANTS[5];
}

export default function Screen3Unlock({ checkinData }) {
  const rating   = checkinData?.rating ?? 5;
  const variants = getVariants(rating);

  const [variantIdx, setVariantIdx]       = useState(0);
  const [review, setReview]               = useState(checkinData?.generated_review || variants[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied]               = useState(false);

  useEffect(() => {
    if (checkinData?.generated_review) setReview(checkinData.generated_review);
    else setReview(variants[0]);
  }, [checkinData?.generated_review]);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const next = (variantIdx + 1) % variants.length;
      setVariantIdx(next);
      setReview(variants[next]);
      setIsRegenerating(false);
    }, 400);
  };

  const handleCopyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(review);
    } catch {
      const el = document.createElement('textarea');
      el.value = review;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    if (checkinData?.id) {
      trackEvent(checkinData.id, 'copied_google_link').catch(() => {});
    }

    const url = 'https://www.google.com/travel/search?q=SAI%20ganga%20cottage&g2lb=4965990%2C72471280%2C72573224%2C72686036%2C72803964%2C72882230%2C72887409%2C73064764%2C121529350%2C121608706%2C121921501%2C121951222%2C122035346%2C122078727%2C122097177%2C122134888%2C122147524%2C122275263%2C122275267%2C122307390&hl=en-IN&gl=in&cs=1&ssta=1&ts=CAEaRwopEicyJTB4MzkwOTE3YTUxOTMyMmJjZjoweGQxYjViMzU0OTViNTM4MDESGhIUCgcI6g8QCxgcEgcI6g8QCxgdGAEyAhAA&qs=CAEyFENnc0lnZkRVcmNucTdOclJBUkFCOAJCCQkBOLWVVLO10Q&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwig5_2DgqaYAxUAAAAAHQAAAAAQCw';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleJoinCommunity = () => {
    if (checkinData?.id) {
      trackEvent(checkinData.id, 'joined_community').catch(() => {});
    }
    const url = import.meta.env.VITE_COMMUNITY_URL || 'https://chat.whatsapp.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 screen-enter max-w-md mx-auto">
      
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm">
            ✅
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Stay Experience Complete</h2>
            <p className="text-[10px] text-emerald-400 font-semibold">Pass Unlocked • Google Compliant</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#161b22] border border-white/10 text-xs font-semibold text-slate-300">
          ⭐ {rating}★ Rated
        </div>
      </div>

      <div className="space-y-4">

        {/* ══ Card 1: Verified Community Pass (WhatsApp) ══ */}
        <div className="cinema-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Community Pass
            </span>
            <span className="text-xs text-slate-400">450+ Travelers</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
            Hostel WhatsApp Circle &amp; Secret Map
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Get instant access to live cafe meetups, trekking buddies, and tonight's hostel acoustic jam.
          </p>

          <button
            onClick={handleJoinCommunity}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#161b22] hover:bg-[#1f2630] border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="text-base">💬</span>
            <span>Join WhatsApp Travelers Community</span>
            <span>→</span>
          </button>
        </div>

        {/* ══ Card 2: AI Review Studio (Google Maps) ══ */}
        <div className="cinema-card p-5 relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">✍️</span>
              <span className="text-xs font-bold text-white">Your Authentic Review Draft</span>
            </div>
            
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              <span>↻</span>
              <span>Regenerate</span>
            </button>
          </div>

          {/* Review Text Container */}
          <div className="p-3.5 rounded-xl bg-[#0d1014] border border-white/10 mb-4 relative min-h-[90px] flex items-center">
            {isRegenerating ? (
              <div className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 py-3">
                <svg className="animate-spin w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Re-phrasing your experience...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{review}"
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleCopyAndOpen}
            className="btn-cinema-primary w-full py-4 px-6 text-sm flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Copied! Opening Google Reviews...</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy Text &amp; Open Google Maps</span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-500 mt-3">
            Zero Review Gating: Both links are unconditionally open to all guests ★
          </p>

        </div>

      </div>

      {/* ── Footer ── */}
      <div className="text-center text-[11px] text-slate-500 pt-3">
        Thank you for staying at Sai Ganga Cottage, Rishikesh
      </div>

    </div>
  );
}
