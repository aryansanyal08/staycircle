import React, { useState, useRef } from 'react';
import { submitCheckin } from '../lib/api';

const RATING_PILLS = [
  { value: 1, emoji: '😞', label: '1★', text: 'Disappointed' },
  { value: 2, emoji: '😐', label: '2★', text: 'Average' },
  { value: 3, emoji: '🙂', label: '3★', text: 'Good' },
  { value: 4, emoji: '😊', label: '4★', text: 'Loved it' },
  { value: 5, emoji: '🤩', label: '5★', text: 'Exceptional' },
];

const VIBE_TAGS = [
  { id: '🔥 Social Vibe', icon: '🔥', label: 'Social Vibe' },
  { id: '🛏️ Clean Dorms', icon: '🛏️', label: 'Clean Dorms' },
  { id: '🙌 Friendly Staff', icon: '🙌', label: 'Friendly Staff' },
  { id: '📶 Fast Wi-Fi', icon: '📶', label: 'Fast Wi-Fi' },
  { id: '📍 Great Location', icon: '📍', label: 'Great Location' },
  { id: '🛠️ Needs Improvement', icon: '🛠️', label: 'Needs Polish' },
];

export default function Screen2Checkin({ bed, property, sessionId, onComplete }) {
  const [rating, setRating]           = useState(null);
  const [tags, setTags]               = useState([]);
  const [note, setNote]               = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState(null);
  const [voiceError, setVoiceError]   = useState('');
  const recognitionRef = useRef(null);

  const toggleTag = (tagId) =>
    setTags((prev) => prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]);

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { 
      setVoiceError('Voice speech transcription not available on this browser'); 
      return; 
    }
    if (isListening) { 
      recognitionRef.current?.stop(); 
      setIsListening(false); 
      return; 
    }
    setVoiceError('');
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onstart  = () => setIsListening(true);
    rec.onresult = (e) => setNote((p) => p ? `${p} ${e.results[0][0].transcript}` : e.results[0][0].transcript);
    rec.onerror  = (e) => { 
      setVoiceError('Voice recording paused'); 
      setIsListening(false); 
    };
    rec.onend    = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitCheckin({ 
        bed_id: bed, 
        property: property || 'Sai Ganga Cottage', 
        rating, 
        tags, 
        note, 
        session_id: sessionId 
      });
      onComplete(result);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 screen-enter max-w-md mx-auto">
      
      {/* ── Top Header Navigation ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-sm">
            ⚡
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Stay Experience Check-in</h2>
            <p className="text-[10px] text-slate-400">10-sec quick tap • Zero mandatory typing</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#161b22] border border-white/10 text-xs font-semibold text-orange-400 flex items-center gap-1.5">
          <span>🛏️</span>
          <span>{bed || 'WALK-IN'}</span>
        </div>
      </div>

      {/* ── Main Container Card ── */}
      <div className="cinema-card p-5 sm:p-6 space-y-6">

        {/* 1. Rating Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. How was your stay?
            </span>
            {rating && (
              <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                {RATING_PILLS.find(p => p.value === rating)?.text}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {RATING_PILLS.map((p) => {
              const isSelected = rating === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setRating(p.value)}
                  className={`py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 border ${
                    isSelected ? 'rating-capsule-active' : 'rating-capsule'
                  }`}
                >
                  <span className="text-2xl transition-transform transform group-hover:scale-110">
                    {p.emoji}
                  </span>
                  <span className="text-[11px] font-bold">
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Highlight Vibes Tag Filter (Reference "Vibe Filters" look) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. What was your rhythm?
            </span>
            <span className="text-[10px] text-slate-500">Multi-select</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {VIBE_TAGS.map((tag) => {
              const isSelected = tags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center justify-between text-left ${
                    isSelected ? 'cinema-pill-active' : 'cinema-pill justify-start gap-2'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{tag.icon}</span>
                    <span>{tag.label}</span>
                  </span>
                  {isSelected && <span className="text-orange-400 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Optional Voice / Note */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Voice Note <span className="text-[10px] lowercase text-slate-500 font-normal">(optional)</span>
            </span>

            <button
              type="button"
              onClick={handleMic}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'cinema-pill text-slate-300'
              }`}
            >
              <span>{isListening ? '🔴' : '🎙️'}</span>
              <span>{isListening ? 'Listening...' : 'Tap & Speak'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Loved the river view, morning meditation & fast Wi-Fi..."
              className="w-full bg-[#0d1014] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
            />
          </div>

          {voiceError && (
            <p className="text-rose-400 text-[10px] mt-1">{voiceError}</p>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            ⚠️ {error}
          </div>
        )}

      </div>

      {/* ── Submit Button Section ── */}
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!rating || isSubmitting}
          className={`w-full py-4 px-6 text-sm flex items-center justify-center gap-2 ${
            !rating || isSubmitting
              ? 'bg-[#181d24] border border-white/5 text-slate-600 cursor-not-allowed rounded-xl font-bold'
              : 'btn-cinema-primary'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Generating Review Ghostwriter...</span>
            </>
          ) : (
            <>
              <span>Unlock Community &amp; Review Draft</span>
              <span className="text-base">→</span>
            </>
          )}
        </button>

        {!rating && (
          <p className="text-center text-[11px] text-slate-500">
            Please tap a rating star (1★ to 5★) to unlock your pass
          </p>
        )}
      </div>

    </div>
  );
}
