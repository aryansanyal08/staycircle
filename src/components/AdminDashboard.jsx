import React, { useState, useEffect, useCallback } from 'react';
import { fetchMetrics, generateQRCodes, BASE } from '../lib/api';

/* ─────────────────────────── helpers ─────────────────────────── */
function fmt(n) {
  if (n === undefined || n === null) return '0';
  return Number(n).toLocaleString();
}

/* ─────────────────────────── sub-components ───────────────────── */

/* KPI Card */
function KpiCard({ label, value, sub, icon, accent = 'text-orange-400' }) {
  return (
    <div className="cinema-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <span className="text-xl p-2 rounded-xl bg-white/5 border border-white/5">{icon}</span>}
      </div>
      <div>
        <span className={`text-3xl font-extrabold ${accent} tracking-tight`}>{fmt(value)}</span>
        {sub && <div className="text-xs text-slate-400 mt-1 font-medium">{sub}</div>}
      </div>
    </div>
  );
}

/* Funnel Bar */
function FunnelBar({ stages }) {
  if (!stages || stages.length === 0) return null;
  const max = Math.max(...stages.map((s) => s.value || 0), 1);

  return (
    <div className="cinema-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Conversion Funnel
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Real-time Guest Journey</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {stages.map((stage) => {
          const width = Math.min(100, Math.round(((stage.value || 0) / max) * 100));
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="w-36 text-xs text-slate-300 font-semibold shrink-0 text-right">{stage.label}</span>
              <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden border border-white/5 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.max(width, stage.value > 0 ? 5 : 0)}%` }}
                />
              </div>
              <span className="w-20 text-xs font-bold text-white text-left">
                {fmt(stage.value)}
                {stage.pct !== undefined && (
                  <span className="text-slate-400 font-normal ml-1">({stage.pct}%)</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Bed-by-bed table */
function BedTable({ rows }) {
  if (!rows || rows.length === 0)
    return <p className="text-xs text-slate-500 italic p-4">No bed scan data recorded yet.</p>;

  return (
    <div className="cinema-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-[#161b22] border-b border-white/10">
            <tr>
              {['Bed / Room', 'QR Scans', 'Check-ins', 'Google Reviews Intent', 'Community Joins'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-bold uppercase tracking-wider text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, i) => {
              const bedName = row.bedId || row.bed_id || 'WALK-IN';
              return (
                <tr key={bedName + i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <span className="text-orange-400">🛏️</span>
                    <span>{bedName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{fmt(row.scans)}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{fmt(row.checkins)}</td>
                  <td className="px-4 py-3 text-amber-400 font-bold">{fmt(row.reviewClicks)}</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold">{fmt(row.communityJoins)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Tag Breakdown */
function TagBreakdown({ tags }) {
  if (!tags || tags.length === 0)
    return <p className="text-xs text-slate-500 italic p-4">No tags selected yet.</p>;

  const max = Math.max(...tags.map((t) => t.count || 0), 1);

  return (
    <div className="cinema-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          What Guests Love Most
        </h3>
        <span className="text-[11px] text-slate-500">Selected Highlights</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {tags.map((t) => {
          const width = Math.round(((t.count || 0) / max) * 100);
          return (
            <div key={t.tag} className="flex items-center gap-3">
              <span className="w-36 text-xs text-slate-200 font-medium shrink-0 text-right truncate" title={t.tag}>
                {t.tag}
              </span>
              <div className="flex-1 bg-white/5 rounded-full h-3.5 overflow-hidden border border-white/5 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(width, 6)}%` }}
                />
              </div>
              <span className="w-12 text-xs font-bold text-white text-left">{t.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Recent check-ins table */
function RecentCheckins({ rows }) {
  if (!rows || rows.length === 0)
    return <p className="text-xs text-slate-500 italic p-4">No recent check-ins yet.</p>;

  return (
    <div className="cinema-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-[#161b22] border-b border-white/10">
            <tr>
              {['Date & Time', 'Bed / Table', 'Rating', 'Tags', 'Generated Review / Note'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-bold uppercase tracking-wider text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, i) => {
              let tagsString = '—';
              if (row.tags) {
                try {
                  const parsed = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    tagsString = parsed.join(', ');
                  }
                } catch {
                  tagsString = String(row.tags);
                }
              }

              const preview = row.reviewText || row.generated_review || row.raw_note || '—';
              const dateRaw = row.createdAt || row.created_at;
              const dateStr = dateRaw ? new Date(dateRaw).toLocaleString() : '—';
              const bedName = row.bedId || row.bed_id || 'WALK-IN';
              const ratingVal = row.rating;

              return (
                <tr key={row.id || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{dateStr}</td>
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                    🛏️ {bedName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {ratingVal ? (
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          ratingVal >= 4
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ratingVal === 3
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {ratingVal} ★
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">QR Scan Only</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate" title={tagsString}>
                    {tagsString}
                  </td>
                  <td className="px-4 py-3 text-slate-400 italic max-w-sm truncate" title={preview}>
                    "{preview}"
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* QR Card */
function QrCard({ item }) {
  return (
    <div className="qr-card bg-[#161b22] border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2.5 shadow-md">
      {item.qrDataUrl ? (
        <div className="bg-white p-2 rounded-xl shadow-inner">
          <img
            src={item.qrDataUrl}
            alt={`QR for ${item.bed}`}
            className="w-36 h-36 object-contain"
          />
        </div>
      ) : (
        <div className="w-36 h-36 flex items-center justify-center bg-white/5 rounded-xl text-slate-500 text-xs">
          {item.error || 'Failed'}
        </div>
      )}
      <span className="text-sm font-bold text-white mt-1">Bed: {item.bed}</span>
      {item.url && (
        <span className="text-[10px] text-slate-400 truncate max-w-full font-mono">
          {item.url}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────── main component ───────────────────── */
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('metrics');

  // QR state
  const [qrBeds, setQrBeds] = useState('B1,B2,B3,B4,B5,B6,Room-101,Room-102');
  const [qrProperty, setQrProperty] = useState('Sai Ganga Cottage');
  const [qrBaseUrl, setQrBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const [qrResults, setQrResults] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  /* ── fetch metrics ── */
  const loadMetrics = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const data = await fetchMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load metrics.');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Initial load + live auto-polling every 4 seconds
  useEffect(() => {
    loadMetrics();
    const interval = setInterval(() => {
      loadMetrics(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [loadMetrics]);

  /* ── QR generate ── */
  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setQrError(null);
    const beds = qrBeds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (beds.length === 0) {
      setQrError('Please enter at least one bed ID.');
      return;
    }
    setQrLoading(true);
    setQrResults([]);
    try {
      const results = await generateQRCodes({
        beds,
        property: qrProperty,
        baseUrl: qrBaseUrl,
      });
      setQrResults(Array.isArray(results) ? results : []);
    } catch (err) {
      setQrError(err.message || 'QR generation failed.');
    } finally {
      setQrLoading(false);
    }
  };

  /* ── funnel stages ── */
  const funnelStages = metrics
    ? [
        { label: '1. QR Scans', value: metrics.totalScans || 0, pct: 100 },
        {
          label: '2. Check-ins Completed',
          value: metrics.totalCheckins || 0,
          pct: metrics.completionPct || '0',
        },
        {
          label: '3. Google Review Intent',
          value: metrics.reviewClicks || 0,
          pct: metrics.reviewPct || '0',
        },
        {
          label: '4. WhatsApp Community Joins',
          value: metrics.communityJoins || 0,
          pct: metrics.communityPct || '0',
        },
      ]
    : [];

  return (
    <>
      <div className="min-h-screen text-slate-100">
        
        {/* ── Header ── */}
        <header className="border-b border-white/10 bg-[#0d1014]/90 backdrop-blur-md sticky top-0 z-30 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-lg">
                📊
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">StayCircle Admin</h1>
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Syncing
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Sai Ganga Cottage • Real-time Conversion Metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadMetrics(false)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-400' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? 'Updating...' : 'Refresh'}</span>
              </button>

              <a
                href={`${BASE}/api/metrics/csv`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </a>
            </div>
          </div>
        </header>

        {/* ── Navigation Tabs ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 no-print">
          <div className="flex gap-2 border-b border-white/10 pb-px">
            {[
              { key: 'metrics', label: '📊 Metrics & Conversion', icon: '⚡' },
              { key: 'qr', label: '📷 QR Code Stickers Generator', icon: '🖨️' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* ══════════ METRICS TAB ══════════ */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* KPI Cards (4 metrics required by specs) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  label="1. Total QR Scans"
                  value={metrics?.totalScans}
                  sub="Guests scanned bed QR stickers"
                  icon="📱"
                  accent="text-cyan-400"
                />
                <KpiCard
                  label="2. Check-ins Completed"
                  value={metrics?.totalCheckins}
                  sub={`${metrics?.completionPct ?? '0'}% completion rate`}
                  icon="✅"
                  accent="text-emerald-400"
                />
                <KpiCard
                  label="3. Google Reviews Clicked"
                  value={metrics?.reviewClicks}
                  sub={`${metrics?.reviewPct ?? '0'}% review intent rate`}
                  icon="⭐"
                  accent="text-amber-400"
                />
                <KpiCard
                  label="4. Community Joins"
                  value={metrics?.communityJoins}
                  sub={`${metrics?.communityPct ?? '0'}% WhatsApp conversion`}
                  icon="💬"
                  accent="text-orange-400"
                />
              </div>

              {/* Funnel Progress */}
              <FunnelBar stages={funnelStages} />

              {/* Bed-by-bed Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Bed-by-Bed Performance</h3>
                    <p className="text-xs text-slate-400">Track scans, ratings and issues per individual dorm bed</p>
                  </div>
                </div>
                <BedTable rows={metrics?.byBed || []} />
              </div>

              {/* Tag Breakdown */}
              <TagBreakdown tags={metrics?.tagBreakdown || metrics?.byTag || []} />

              {/* Recent Check-ins */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Recent Guest Activity</h3>
                    <p className="text-xs text-slate-400">Latest 20 check-ins and generated reviews</p>
                  </div>
                </div>
                <RecentCheckins rows={metrics?.recentCheckins || []} />
              </div>

            </div>
          )}

          {/* ══════════ QR GENERATOR TAB ══════════ */}
          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="cinema-card p-6 no-print">
                <h2 className="text-base font-bold text-white mb-1">Generate Print-Ready QR Stickers</h2>
                <p className="text-xs text-slate-400 mb-5">
                  Generate distinct QR codes for every bed in your dorms or hotel rooms. Print them and paste them on bedposts or bedside switches.
                </p>

                <form onSubmit={handleGenerateQR} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Bed / Room IDs <span className="text-slate-500 font-normal">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={qrBeds}
                        onChange={(e) => setQrBeds(e.target.value)}
                        placeholder="B1, B2, B3, Room-101"
                        className="w-full bg-[#161b22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Property Name
                      </label>
                      <input
                        type="text"
                        value={qrProperty}
                        onChange={(e) => setQrProperty(e.target.value)}
                        placeholder="Sai Ganga Cottage"
                        className="w-full bg-[#161b22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={qrBaseUrl}
                        onChange={(e) => setQrBaseUrl(e.target.value)}
                        placeholder="https://your-domain.onrender.com"
                        className="w-full bg-[#161b22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {qrError && (
                    <p className="text-rose-400 text-xs">⚠️ {qrError}</p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={qrLoading}
                      className="btn-cinema-primary py-3 px-6 text-xs font-bold flex items-center gap-2"
                    >
                      {qrLoading ? 'Generating...' : '⚡ Generate QR Codes'}
                    </button>

                    {qrResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/10"
                      >
                        <span>🖨️</span>
                        <span>Print All Stickers</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* QR Grid */}
              {qrResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 no-print px-1">
                    <h3 className="text-sm font-bold text-white">Generated Stickers ({qrResults.length})</h3>
                    <span className="text-xs text-slate-400">Click Print All to print on sticker paper</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 qr-print-grid">
                    {qrResults.map((item) => (
                      <QrCard key={item.bed} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
