import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../lib/api';

/* ─────────────────────────────────────────────
   Client-side review variations by star rating
───────────────────────────────────────────────*/
const REVIEW_VARIANTS = {
  1: [
    "Honestly, the stay didn't meet my expectations. The facilities need improvement and the overall experience was disappointing. Hoping the management addresses the issues soon.",
    "My experience here was quite poor. Several things didn't work as expected and I found the place lacking basic standards. Would not recommend until improvements are made.",
    "Unfortunately, this wasn't a good stay. The cleanliness and facilities were below par and the staff wasn't very helpful. The place has potential but needs serious work.",
  ],
  2: [
    "The stay was just okay — nothing special. A few things could be improved, like the facilities and overall cleanliness. The location was convenient, though.",
    "Decent enough for one night but I wouldn't go out of my way to return. Average cleanliness, average staff, average experience. Expected more.",
    "It was an average experience overall. Some things were fine but enough things were below par that I left underwhelmed. Hopefully they improve with time.",
  ],
  3: [
    "A decent stay overall! The vibe was friendly and the location worked well for me. A few things could be polished up but nothing major. Would consider coming back.",
    "Pretty solid mid-range hostel experience. Good crowd, reasonable facilities, and the staff was helpful. Not perfect, but definitely a good option for budget travelers.",
    "Overall a reasonable stay. The dorms were clean enough and the people were friendly. It's a good social hub if you're travelling solo or in a group.",
  ],
  4: [
    "Had a great time at this hostel! The staff was super friendly, the dorms were clean, and the social vibe was amazing. Would definitely recommend to anyone travelling through.",
    "Really enjoyed my stay here! Excellent location, clean facilities, and a welcoming community. Met some awesome fellow travelers and made great memories. Highly recommend!",
    "Loved it! The hostel had a fantastic energy — everyone was friendly and the events kept things lively. Clean, comfortable, and great value. Will be back for sure.",
  ],
  5: [
    "Absolutely loved this place! 🌟 The staff went above and beyond, the dorms were spotless, the Wi-Fi was fast, and the social scene was incredible. Best hostel experience I've had. HIGHLY recommend to every traveler!",
    "10/10 experience from start to finish! The community here is unmatched — met lifelong friends, joined amazing events, and found hidden local gems through the community board. Truly special. Don't miss it!",
    "This hostel blew me away! Immaculate dorms, legendary staff, the perfect location, and a traveler community that felt like family. If you're passing through — this is THE place to stay. Five stars all the way! ⭐⭐⭐⭐⭐",
  ],
};

function getVariants(rating) {
  const key = Math.min(5, Math.max(1, Math.round(rating || 3)));
  return REVIEW_VARIANTS[key] || REVIEW_VARIANTS[3];
}

/* ─────────────────────
   Toast component
─────────────────────*/
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <div className="bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap">
        <span>✅</span>
        {message}
      </div>
    </div>
  );
}

/* ─────────────────────
   Main Component
─────────────────────*/
export default function Screen3Unlock({ checkinData }) {
  const rating = checkinData?.rating ?? 3;
  const variants = getVariants(rating);

  const [variantIdx, setVariantIdx] = useState(0);
  const [review, setReview] = useState(checkinData?.generated_review || variants[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  // If a server-generated review is provided, use it; fall back to client variants
  useEffect(() => {
    if (checkinData?.generated_review) {
      setReview(checkinData.generated_review);
    } else {
      setReview(variants[0]);
    }
  }, [checkinData?.generated_review]);

  /* ── Regenerate (client-side round-robin) ── */
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const nextIdx = (variantIdx + 1) % variants.length;
      setVariantIdx(nextIdx);
      setReview(variants[nextIdx]);
      setIsRegenerating(false);
    }, 500);
  };

  /* ── Copy + Open Google Maps ── */
  const handleCopyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(review);
    } catch {
      // Fallback: select text
      const el = document.createElement('textarea');
      el.value = review;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    // Show toast
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);

    // Track event
    if (checkinData?.id) {
      trackEvent(checkinData.id, 'copied_google_link').catch(() => {});
    }

    // Open Google review URL
    const googleUrl = import.meta.env.VITE_GOOGLE_REVIEW_URL || 'https://maps.google.com';
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  /* ── Join Community ── */
  const handleJoinCommunity = () => {
    if (checkinData?.id) {
      trackEvent(checkinData.id, 'joined_community').catch(() => {});
    }
    const communityUrl = import.meta.env.VITE_COMMUNITY_URL || 'https://chat.whatsapp.com';
    window.open(communityUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Toast */}
      <Toast message="Copied! Paste on Google Maps ✅" visible={toastVisible} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-5">

          {/* ═══════════════════════════════════
              Card 1 — Community Pass Unlocked
          ═══════════════════════════════════*/}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Green header bar */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <h2 className="text-white text-lg font-extrabold leading-tight">
                    Community Pass Unlocked!
                  </h2>
                  <p className="text-green-100 text-xs mt-0.5">
                    You're now part of the verified traveler circle
                  </p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="bg-white/5 backdrop-blur-md px-6 py-5">
              <p className="text-gray-300 text-sm mb-4">
                Connect with fellow travelers, get access to the secret local map, and get
                notified about tonight's hostel events — all in one WhatsApp group.
              </p>

              <button
                onClick={handleJoinCommunity}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40 flex items-center justify-center gap-2 text-base"
              >
                <span className="text-xl">💬</span>
                Join WhatsApp Travelers Community →
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════
              Card 2 — Google Review Draft
          ═══════════════════════════════════*/}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-white/10">
              <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
                ✍️ Your Review Draft
              </h3>
              <p className="text-gray-400 text-sm mt-0.5">
                Share your experience on Google Maps
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Review blockquote */}
              <div className="relative bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
                {isRegenerating ? (
                  <div className="flex items-center justify-center py-4">
                    <svg
                      className="animate-spin w-5 h-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">Regenerating…</span>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm italic leading-relaxed">{review}</p>
                )}
              </div>

              {/* Regenerate link */}
              <div className="text-right">
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="text-green-400 hover:text-green-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                >
                  <span className="text-sm">↻</span>
                  Regenerate
                </button>
              </div>

              {/* Primary CTA */}
              <button
                onClick={handleCopyAndOpen}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/40 flex items-center justify-center gap-2 text-base"
              >
                📋 Copy Text &amp; Open Google Maps
              </button>

              {/* Zero-gating notice */}
              <p className="text-center text-gray-500 text-xs">
                Both links are always available regardless of your rating ★
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
