import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../lib/api';

/* ── Review variants by star rating ── */
const REVIEW_VARIANTS = {
  1: [
    "Honestly, the stay didn't meet my expectations. The facilities need improvement and the overall experience was disappointing. Hoping the management addresses the issues soon.",
    "My experience here was quite poor. Several things didn't work as expected and I found the place lacking basic standards. Would not recommend until improvements are made.",
    "Unfortunately, this wasn't a good stay. The cleanliness and facilities were below par and the staff wasn't very helpful. The place has potential but needs serious work.",
  ],
  2: [
    "The stay was just okay — nothing special. A few things could be improved, like the facilities and overall cleanliness. The location was convenient, though.",
    "Decent enough for one night but I wouldn't go out of my way to return. Average cleanliness, average staff, average experience. Expected more.",
    "It was an average experience overall. Some things were fine but enough were below par that I left underwhelmed. Hopefully they improve with time.",
  ],
  3: [
    "A decent stay overall! The vibe was friendly and the location worked well for me. A few things could be polished up but nothing major. Would consider coming back.",
    "Pretty solid mid-range hostel experience. Good crowd, reasonable facilities, and the staff was helpful. Not perfect, but definitely a good option for budget travelers.",
    "Overall a reasonable stay. The dorms were clean enough and the people were friendly. It's a good social hub if you're travelling solo or in a group.",
  ],
  4: [
    "Had a great time at this hostel! The staff was super friendly, the dorms were clean, and the social vibe was amazing. Would definitely recommend to anyone travelling through.",
    "Really enjoyed my stay here! Excellent location, clean facilities, and a welcoming community. Met some awesome fellow travelers. Highly recommend!",
    "Loved it! The hostel had a fantastic energy — everyone was friendly and the events kept things lively. Clean, comfortable, and great value. Will be back for sure.",
  ],
  5: [
    "Absolutely loved this place! 🌟 The staff went above and beyond, the dorms were spotless, the Wi-Fi was fast, and the social scene was incredible. Best hostel experience I've had. HIGHLY recommend!",
    "10/10 experience from start to finish! The community here is unmatched — met lifelong friends, joined amazing events, and found hidden local gems. Truly special. Don't miss it!",
    "This hostel blew me away! Immaculate dorms, legendary staff, the perfect location, and a traveler community that felt like family. If you're passing through — this is THE place. ⭐⭐⭐⭐⭐",
  ],
};

function getVariants(rating) {
  const key = Math.min(5, Math.max(1, Math.round(rating || 3)));
  return REVIEW_VARIANTS[key] || REVIEW_VARIANTS[3];
}

/* ── Toast ── */
function Toast({ message, visible }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="text-white text-sm font-bold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', boxShadow: '0 8px 24px rgba(13,148,136,0.5)' }}>
        ✅ {message}
      </div>
    </div>
  );
}

export default function Screen3Unlock({ checkinData }) {
  const rating   = checkinData?.rating ?? 3;
  const variants = getVariants(rating);

  const [variantIdx, setVariantIdx]       = useState(0);
  const [review, setReview]               = useState(checkinData?.generated_review || variants[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toastVisible, setToastVisible]   = useState(false);
  const toastTimerRef = useRef(null);

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
    }, 500);
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
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
    if (checkinData?.id) trackEvent(checkinData.id, 'copied_google_link').catch(() => {});
    const url = import.meta.env.VITE_GOOGLE_REVIEW_URL || 'https://maps.google.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleJoinCommunity = () => {
    if (checkinData?.id) trackEvent(checkinData.id, 'joined_community').catch(() => {});
    const url = import.meta.env.VITE_COMMUNITY_URL || 'https://chat.whatsapp.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Toast message="Copied! Paste on Google Maps" visible={toastVisible} />

      <div className="min-h-screen flex items-center justify-center px-4 py-8 screen-enter">
        <div className="w-full max-w-md space-y-5">

          {/* ═══ Card 1 — Community Pass ═══ */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

            {/* Tropical header bar */}
            <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>✅</div>
                <div>
                  <h2 className="text-white text-lg font-extrabold leading-tight">
                    Community Pass Unlocked! 🌴
                  </h2>
                  <p className="text-teal-100 text-xs mt-0.5">
                    You're now part of the verified traveler circle
                  </p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-6 py-5" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Connect with fellow travelers, get access to the secret local map, and get notified about tonight's hostel events — all in one WhatsApp group.
              </p>
              <button onClick={handleJoinCommunity}
                className="btn-teal w-full py-4 px-6 flex items-center justify-center gap-2 text-base">
                <span className="text-xl">💬</span>
                Join WhatsApp Travelers Community →
              </button>
            </div>
          </div>

          {/* ═══ Card 2 — Review Draft ═══ */}
          <div className="trop-card overflow-hidden">
            <div className="px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
                ✍️ Your Review Draft
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#99f6e4' }}>
                Share your experience on Google Maps
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Review blockquote */}
              <div className="relative rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.08)', borderLeft: '4px solid #f97316' }}>
                {isRegenerating ? (
                  <div className="flex items-center justify-center py-4 gap-2">
                    <svg className="animate-spin w-5 h-5" style={{ color: '#fb923c' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Regenerating…</span>
                  </div>
                ) : (
                  <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{review}</p>
                )}
              </div>

              {/* Regenerate */}
              <div className="text-right">
                <button onClick={handleRegenerate} disabled={isRegenerating}
                  className="text-xs font-semibold transition-colors disabled:opacity-40 inline-flex items-center gap-1"
                  style={{ color: '#fb923c' }}>
                  <span>↻</span> Regenerate
                </button>
              </div>

              {/* Primary CTA */}
              <button onClick={handleCopyAndOpen}
                className="btn-coral w-full py-4 px-6 flex items-center justify-center gap-2 text-base">
                📋 Copy Text &amp; Open Google Maps
              </button>

              {/* Zero-gating notice */}
              <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Both links are always available regardless of your rating ★
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
