import React, { useState, useRef } from 'react';
import { submitCheckin } from '../lib/api';

const RATING_PILLS = [
  { value: 1, label: '1 😞' },
  { value: 2, label: '2 😐' },
  { value: 3, label: '3 🙂' },
  { value: 4, label: '4 😊' },
  { value: 5, label: '5 🤩' },
];

const HIGHLIGHT_TAGS = [
  '🔥 Social Vibe',
  '🛏️ Clean Dorms',
  '🙌 Friendly Staff',
  '📶 Fast Wi-Fi',
  '📍 Great Location',
  '🛠️ Needs Improvement',
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

  const toggleTag = (tag) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceError('Voice not supported on this browser'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    setVoiceError('');
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.onstart  = () => setIsListening(true);
    rec.onresult = (e) => setNote((p) => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
    rec.onerror  = (e) => { setVoiceError('Could not capture voice: ' + e.error); setIsListening(false); };
    rec.onend    = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitCheckin({ bed_id: bed, property, rating, tags, note, session_id: sessionId });
      onComplete(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 screen-enter">
      <div className="w-full max-w-md">
        <div className="trop-card overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg,rgba(13,148,136,0.3),rgba(8,145,178,0.2))' }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-extrabold text-white">⏱️ 10-Sec Check-In</h2>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.25)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.4)' }}>
                🛏️ {bed || 'WALK-IN'}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Quick &amp; anonymous · no typing needed
            </p>
          </div>

          <div className="px-6 py-5 space-y-6">

            {/* ── Rating ── */}
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: '#99f6e4' }}>
                How was your stay? ✨
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {RATING_PILLS.map((p) => (
                  <button key={p.value} onClick={() => setRating(p.value)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 border ${
                      rating === p.value ? 'pill-active' : 'pill'
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Highlights ── */}
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: '#99f6e4' }}>
                What stood out? 🌟
              </label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_TAGS.map((tag) => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      tags.includes(tag) ? 'pill-active' : 'pill'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Optional Note + Mic ── */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#99f6e4' }}>
                Quick thought?{' '}
                <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
              </label>
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Great rooftop view, friendly staff..."
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none transition"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', focusBorderColor: '#0d9488' }} />

              <button onClick={handleMic}
                className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isListening
                    ? 'animate-pulse'
                    : ''
                }`}
                style={isListening
                  ? { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5' }
                  : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.65)' }
                }>
                <span>{isListening ? '🔴' : '🎤'}</span>
                {isListening ? 'Listening…' : 'Hold/Tap to Speak'}
              </button>
              {voiceError && <p className="text-red-400 text-xs mt-1.5">{voiceError}</p>}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-300"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── CTA ── */}
            <button onClick={handleSubmit} disabled={!rating || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                !rating || isSubmitting ? 'cursor-not-allowed opacity-50' : 'btn-coral'
              }`}
              style={!rating || isSubmitting ? { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' } : {}}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting…
                </>
              ) : (
                <>🌊 Unlock Community &amp; Review Draft →</>
              )}
            </button>

            {!rating && (
              <p className="text-center text-xs -mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Select a rating above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
