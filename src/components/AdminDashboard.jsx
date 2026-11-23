import { useState, useEffect, useCallback } from 'react';
import { fetchMetrics, generateQRCodes } from '../lib/api';

/* ─────────────────────────── helpers ─────────────────────────── */
function fmt(n) {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString();
}

function pct(label, value) {
  if (value === undefined || value === null) return label;
  return `${label} (${value}%)`;
}

/* ─────────────────────────── sub-components ───────────────────── */

/* KPI Card */
function KpiCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <span className="text-3xl font-bold text-green-600">{fmt(value)}</span>
      {sub && <span className="text-sm text-gray-500">{sub}</span>}
    </div>
  );
}

/* Funnel Bar */
function FunnelBar({ stages }) {
  if (!stages || stages.length === 0) return null;
  const max = Math.max(...stages.map((s) => s.value || 0), 1);

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Conversion Funnel
      </h3>
      <div className="flex flex-col gap-3">
        {stages.map((stage) => {
          const width = Math.round(((stage.value || 0) / max) * 100);
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="w-36 text-sm text-gray-600 shrink-0 text-right">{stage.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-5 rounded-full bg-green-400 transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-16 text-sm font-semibold text-gray-700 text-left">
                {fmt(stage.value)}
                {stage.pct !== undefined && (
                  <span className="text-gray-400 font-normal ml-1">({stage.pct}%)</span>
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
    return <p className="text-sm text-gray-400 italic">No bed data available.</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {['Bed ID', 'Scans', 'Check-ins', 'Review Clicks', 'Community Joins'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.bedId || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 font-medium text-gray-800">{row.bedId}</td>
                <td className="px-4 py-2 text-gray-700">{fmt(row.scans)}</td>
                <td className="px-4 py-2 text-gray-700">{fmt(row.checkins)}</td>
                <td className="px-4 py-2 text-gray-700">{fmt(row.reviewClicks)}</td>
                <td className="px-4 py-2 text-gray-700">{fmt(row.communityJoins)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Tag Breakdown */
function TagBreakdown({ tags }) {
  if (!tags || tags.length === 0)
    return <p className="text-sm text-gray-400 italic">No tag data available.</p>;

  const max = Math.max(...tags.map((t) => t.count || 0), 1);

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Tag Breakdown
      </h3>
      <div className="flex flex-col gap-2">
        {tags.map((t) => {
          const width = Math.round(((t.count || 0) / max) * 100);
          return (
            <div key={t.tag} className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600 shrink-0 text-right truncate" title={t.tag}>
                {t.tag}
              </span>
              <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                <div
                  className="h-4 rounded bg-green-400 transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-10 text-sm font-semibold text-gray-700 text-left">{t.count}</span>
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
    return <p className="text-sm text-gray-400 italic">No recent check-ins.</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {['Date', 'Bed', 'Rating', 'Tags', 'Review Preview'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const tags = Array.isArray(row.tags)
                ? row.tags.join(', ')
                : typeof row.tags === 'string'
                ? row.tags
                : '—';
              const preview =
                row.reviewText && row.reviewText.length > 60
                  ? row.reviewText.slice(0, 60) + '…'
                  : row.reviewText || '—';
              const dateStr = row.createdAt
                ? new Date(row.createdAt).toLocaleString()
                : '—';
              return (
                <tr key={row.id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{dateStr}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">{row.bedId || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.rating >= 4
                          ? 'bg-green-100 text-green-700'
                          : row.rating === 3
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.rating ? `${row.rating} ★` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600 max-w-xs truncate" title={tags}>
                    {tags}
                  </td>
                  <td className="px-4 py-2 text-gray-500 italic max-w-xs" title={row.reviewText || ''}>
                    {preview}
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
    <div className="qr-card bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
      {item.qrDataUrl ? (
        <img
          src={item.qrDataUrl}
          alt={`QR for ${item.bed}`}
          className="w-36 h-36 object-contain"
        />
      ) : (
        <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs">
          {item.error || 'Error'}
        </div>
      )}
      <span className="text-sm font-semibold text-gray-700 mt-1">{item.bed}</span>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-green-600 underline truncate max-w-full"
          title={item.url}
        >
          {item.url.length > 40 ? item.url.slice(0, 40) + '…' : item.url}
        </a>
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
  const [qrBeds, setQrBeds] = useState('B1,B2,B3,B4,B5,B6');
  const [qrProperty, setQrProperty] = useState('goSTOPS');
  const [qrBaseUrl, setQrBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const [qrResults, setQrResults] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  /* ── fetch metrics ── */
  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
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
        { label: 'QR Scans', value: metrics.totalScans, pct: 100 },
        {
          label: 'Check-ins',
          value: metrics.totalCheckins,
          pct: metrics.completionPct,
        },
        {
          label: 'Review Clicks',
          value: metrics.reviewClicks,
          pct: metrics.reviewPct,
        },
        {
          label: 'Community Joins',
          value: metrics.communityJoins,
          pct: metrics.communityPct,
        },
      ]
    : [];

  /* ── render ── */
  return (
    <>
      {/* print styles — only show qr-print-grid when printing */}
      <style>{`
        @media print {
          body > *:not(#root) { display: none !important; }
          .no-print { display: none !important; }
          .qr-print-grid { display: grid !important; }
          .qr-card { break-inside: avoid; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* ── header ── */}
        <header className="bg-white border-b border-gray-200 shadow-sm no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StayCircle Admin</h1>
                <p className="text-xs text-gray-400">Internal dashboard</p>
              </div>
            </div>
            {activeTab === 'metrics' && (
              <button
                onClick={loadMetrics}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            )}
          </div>
        </header>

        {/* ── tabs ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 no-print">
          <div className="flex gap-1 mt-6 border-b border-gray-200">
            {[
              { key: 'metrics', label: '📊 Metrics' },
              { key: 'qr', label: '📷 QR Generator' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white border border-b-white border-gray-200 -mb-px text-green-700'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── tab content ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ══════════ METRICS TAB ══════════ */}
          {activeTab === 'metrics' && (
            <div className="flex flex-col gap-8 no-print">
              {/* error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Error:</strong> {error}
                  </span>
                </div>
              )}

              {/* loading skeleton */}
              {loading && !metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              )}

              {metrics && (
                <>
                  {/* KPI cards */}
                  <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <KpiCard
                        label="Total QR Scans"
                        value={metrics.totalScans}
                        icon="📱"
                      />
                      <KpiCard
                        label="Check-ins Submitted"
                        value={metrics.totalCheckins}
                        sub={`${metrics.completionPct ?? '—'}% of scans`}
                        icon="✅"
                      />
                      <KpiCard
                        label="Review Clicks"
                        value={metrics.reviewClicks}
                        sub={`${metrics.reviewPct ?? '—'}% of check-ins`}
                        icon="⭐"
                      />
                      <KpiCard
                        label="Community Joins"
                        value={metrics.communityJoins}
                        sub={`${metrics.communityPct ?? '—'}% of check-ins`}
                        icon="🤝"
                      />
                    </div>
                  </section>

                  {/* Funnel */}
                  <section>
                    <FunnelBar stages={funnelStages} />
                  </section>

                  {/* Bed table */}
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-800">Bed-by-Bed Breakdown</h3>
                      <a
                        href="/api/metrics/csv"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Export CSV
                      </a>
                    </div>
                    <BedTable rows={metrics.byBed || []} />
                  </section>

                  {/* Tag breakdown */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Tag Breakdown</h3>
                    <TagBreakdown tags={metrics.tagBreakdown || []} />
                  </section>

                  {/* Recent check-ins */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                      Recent Check-ins
                      <span className="ml-2 text-xs font-normal text-gray-400">(last 20)</span>
                    </h3>
                    <RecentCheckins rows={metrics.recentCheckins || []} />
                  </section>
                </>
              )}
            </div>
          )}

          {/* ══════════ QR GENERATOR TAB ══════════ */}
          {activeTab === 'qr' && (
            <div className="flex flex-col gap-8">
              {/* form */}
              <div className="bg-white rounded-xl shadow p-6 no-print">
                <h2 className="text-base font-semibold text-gray-800 mb-5">Generate QR Codes</h2>
                <form onSubmit={handleGenerateQR} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Bed IDs */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700" htmlFor="qr-beds">
                        Bed IDs <span className="text-gray-400 font-normal">(comma-separated)</span>
                      </label>
                      <input
                        id="qr-beds"
                        type="text"
                        value={qrBeds}
                        onChange={(e) => setQrBeds(e.target.value)}
                        placeholder="B1,B2,B3,B4,B5,B6"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* Property */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700" htmlFor="qr-property">
                        Property Name
                      </label>
                      <input
                        id="qr-property"
                        type="text"
                        value={qrProperty}
                        onChange={(e) => setQrProperty(e.target.value)}
                        placeholder="goSTOPS"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>

                    {/* Base URL */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700" htmlFor="qr-baseurl">
                        Base URL
                      </label>
                      <input
                        id="qr-baseurl"
                        type="url"
                        value={qrBaseUrl}
                        onChange={(e) => setQrBaseUrl(e.target.value)}
                        placeholder="https://your-domain.com"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {qrError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {qrError}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={qrLoading}
                      className="px-6 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {qrLoading && (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      )}
                      {qrLoading ? 'Generating…' : '📷 Generate QR Codes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* QR results */}
              {qrResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 no-print">
                    <h3 className="text-base font-semibold text-gray-800">
                      Generated QR Codes
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        ({qrResults.length} codes)
                      </span>
                    </h3>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Print All
                    </button>
                  </div>

                  {/* grid — shown on screen AND when printing */}
                  <div
                    className="qr-print-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  >
                    {qrResults.map((item, i) => (
                      <QrCard key={item.bed || i} item={item} />
                    ))}
                  </div>

                  {/* print helper text */}
                  <p className="mt-3 text-xs text-gray-400 no-print">
                    Click <strong>Print All</strong> to open the system print dialog. Only the QR grid
                    will appear on the printed page.
                  </p>
                </div>
              )}

              {/* empty state */}
              {qrResults.length === 0 && !qrLoading && (
                <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center gap-3 text-center no-print">
                  <span className="text-5xl">📷</span>
                  <p className="text-gray-500 text-sm">
                    Fill in the form above and click <strong>Generate QR Codes</strong> to create
                    printable QR stickers for each bed.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4 border-t border-gray-200 no-print">
          <p className="text-xs text-gray-400 text-center">
            StayCircle Admin · Internal use only
          </p>
        </footer>
      </div>
    </>
  );
}
