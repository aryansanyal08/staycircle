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
  const [rating, setRating] = useState(null);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [voiceError, setVoiceError] = useState('');

  const recognitionRef = useRef(null);

  /* ---- Tag toggle ---- */
  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  /* ---- Voice / Mic ---- */
  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice not supported on this browser');
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setVoiceError('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event) => {
      setVoiceError('Could not capture voice: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  /* ---- Submit ---- */
  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitCheckin({
        bed_id: bed,
        property,
        rating,
        tags,
        note,
        session_id: sessionId,
      });
      onComplete(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-extrabold text-white">10-Sec Check-In</h2>
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/30">
                🛏️ Bed: {bed || '—'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Quick &amp; anonymous — takes 10 seconds</p>
          </div>

          <div className="px-6 py-5 space-y-6">

            {/* ── Rating ── */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">
                How was your stay so far?
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {RATING_PILLS.map((pill) => (
                  <button
                    key={pill.value}
                    onClick={() => setRating(pill.value)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border
                      ${rating === pill.value
                        ? 'bg-green-500 border-green-400 text-white scale-110 shadow-lg shadow-green-900/40'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Highlights ── */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">
                What stood out?
              </label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                      ${tags.includes(tag)
                        ? 'bg-green-500/20 border-green-400/50 text-green-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Optional note + mic ── */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Any quick thought?{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Great rooftop view, friendly staff..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition"
              />

              {/* Mic button */}
              <button
                onClick={handleMic}
                className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 border
                  ${isListening
                    ? 'bg-red-500/20 border-red-400/50 text-red-300 animate-pulse'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                  }`}
              >
                <span>{isListening ? '🔴' : '🎤'}</span>
                {isListening ? 'Listening…' : 'Hold/Tap to Speak'}
              </button>

              {voiceError && (
                <p className="text-red-400 text-xs mt-1.5">{voiceError}</p>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            {/* ── CTA ── */}
            <button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2
                ${!rating || isSubmitting
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-900/40 active:scale-95'
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white"
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
                  Submitting…
                </>
              ) : (
                <>Unlock Community &amp; Review Draft →</>
              )}
            </button>

            {!rating && (
              <p className="text-center text-gray-600 text-xs -mt-2">
                Select a rating above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
