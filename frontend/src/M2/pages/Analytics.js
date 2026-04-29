import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { getAllBookings } from '../api/bookingApi';
import AdminSidebar from '../../AdminDashboard/AdminSidebar';
import './Analytics.css';

/* ── Colour system ──────────────────────────────────────── */
const STATUS_COLORS = {
  APPROVED:  '#10b981',
  PENDING:   '#f59e0b',
  REJECTED:  '#ef4444',
  CANCELLED: '#94a3b8',
};

/* ── Custom tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <p className="an-tooltip-label">{label}</p>
      <p className="an-tooltip-value">{payload[0].value} bookings</p>
    </div>
  );
}

/* ── Stat card ──────────────────────────────────────────── */
function StatCard({ label, value, icon, colorClass, barColor }) {
  return (
    <div className="an-stat">
      <div className={`an-stat-icon ${colorClass}`}>{icon}</div>
      <div>
        <div className="an-stat-value">{value}</div>
        <div className="an-stat-label">{label}</div>
        <div className="an-stat-bar" style={{ background: barColor, opacity: 0.35 }} />
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Analytics() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="an-loading">⏳ Loading analytics…</div>;
  if (error)   return <div className="an-error">⚠ {error}</div>;

  /* ── Derived data ─────────────────────────────────────── */

  // Status breakdown
  const statusCount = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const total = bookings.length;

  // Check if all bookings are one status (pie would show 100%)
  const dominantStatus = Object.entries(statusCount).find(([, v]) => v === total);

  // Top resources
  const resourceCount = bookings.reduce((acc, b) => {
    const key = `R-${b.resourceId}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const resourceData = Object.entries(resourceCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Peak hours
  const hourCount = bookings.reduce((acc, b) => {
    if (b.startTime) {
      const hour = `${b.startTime.slice(0, 2)}:00`;
      acc[hour] = (acc[hour] || 0) + 1;
    }
    return acc;
  }, {});
  const hourData = Object.entries(hourCount)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // Daily trend (last 14 days)
  const dateCount = bookings.reduce((acc, b) => {
    if (b.bookingDate) {
      acc[b.bookingDate] = (acc[b.bookingDate] || 0) + 1;
    }
    return acc;
  }, {});
  const dateData = Object.entries(dateCount)
    .map(([date, count]) => ({ date: date.slice(5), count })) // show MM-DD
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  // Insights
  const peakHour     = hourData.sort((a, b) => b.count - a.count)[0];
  const topResource  = resourceData[0];
  const avgPerDay    = dateData.length
    ? (dateData.reduce((s, d) => s + d.count, 0) / dateData.length).toFixed(1)
    : '—';

  // Re-sort hourData for chart
  const hourDataSorted = [...hourData].sort((a, b) => a.hour.localeCompare(b.hour));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <AdminSidebar />

      <div className="an-root" style={{ flex: 1 }}>
        <div className="an-inner">

          {/* ── Header ── */}
          <div className="an-header">
            <div className="an-header-left">
              <h1>Analytics Dashboard</h1>
              <p>Campus resource booking insights and trends</p>
            </div>
            <button className="an-back-btn" onClick={() => navigate('/admin-dashboard')}>
              ← Back to Dashboard
            </button>
          </div>

          {/* ── Stat cards ── */}
          <div className="an-stats">
            <StatCard label="Total Bookings"  value={total}                          icon="📋" colorClass="an-stat-icon-indigo" barColor="#6366f1" />
            <StatCard label="Approved"        value={statusCount['APPROVED']  || 0}  icon="✅" colorClass="an-stat-icon-green"  barColor="#10b981" />
            <StatCard label="Pending"         value={statusCount['PENDING']   || 0}  icon="⏳" colorClass="an-stat-icon-amber"  barColor="#f59e0b" />
            <StatCard label="Rejected"        value={statusCount['REJECTED']  || 0}  icon="❌" colorClass="an-stat-icon-red"    barColor="#ef4444" />
          </div>

          {/* ── Insights strip ── */}
          <div className="an-insights">
            <div className="an-insight">
              <span className="an-insight-emoji">🕐</span>
              <div>
                <div className="an-insight-title">Peak Booking Hour</div>
                <div className="an-insight-value">
                  {peakHour ? `${peakHour.hour} (${peakHour.count} bookings)` : 'No data'}
                </div>
              </div>
            </div>
            <div className="an-insight">
              <span className="an-insight-emoji">🏆</span>
              <div>
                <div className="an-insight-title">Most Booked Resource</div>
                <div className="an-insight-value">
                  {topResource ? `${topResource.name} — ${topResource.count} times` : 'No data'}
                </div>
              </div>
            </div>
            <div className="an-insight">
              <span className="an-insight-emoji">📈</span>
              <div>
                <div className="an-insight-title">Avg Bookings / Day</div>
                <div className="an-insight-value">{avgPerDay} bookings</div>
              </div>
            </div>
          </div>

          {/* ── Main trend chart ── */}
          <div className="an-trend-card">
            <div className="an-card-header">
              <div>
                <p className="an-card-title">Daily Bookings Trend</p>
                <p className="an-card-sub">Last 14 days of booking activity</p>
              </div>
              <span className="an-card-badge">Last 14 days</span>
            </div>
            {dateData.length === 0 ? (
              <div className="an-empty">
                <span className="an-empty-icon">📭</span>No booking data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dateData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                  barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9', radius: 6 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {dateData.map((_, i) => (
                      <Cell key={i} fill={i === dateData.length - 1 ? '#6366f1' : '#c7d2fe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Small charts grid ── */}
          <div className="an-charts-grid">

            {/* Status breakdown */}
            <div className="an-chart-card">
              <div className="an-card-header">
                <div>
                  <p className="an-card-title">Booking Status Breakdown</p>
                  <p className="an-card-sub">
                    {dominantStatus
                      ? `All bookings are ${dominantStatus[0]}`
                      : 'Distribution across all statuses'}
                  </p>
                </div>
              </div>

              {total === 0 ? (
                <div className="an-empty"><span className="an-empty-icon">📭</span>No data</div>
              ) : (
                <div className="an-status-summary">
                  {Object.entries(STATUS_COLORS).map(([status, color]) => {
                    const count = statusCount[status] || 0;
                    if (count === 0) return null;
                    const pct = ((count / total) * 100).toFixed(0);
                    return (
                      <div key={status} className="an-status-row">
                        <div className="an-status-dot" style={{ background: color }} />
                        <span className="an-status-name">{status}</span>
                        <div className="an-status-bar-bg">
                          <div className="an-status-bar-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="an-status-count">{count}</span>
                        <span className="an-status-pct">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top resources */}
            <div className="an-chart-card">
              <div className="an-card-header">
                <div>
                  <p className="an-card-title">Top Booked Resources</p>
                  <p className="an-card-sub">Most requested campus facilities</p>
                </div>
              </div>
              {resourceData.length === 0 ? (
                <div className="an-empty"><span className="an-empty-icon">📭</span>No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={resourceData} layout="vertical"
                    margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={48}
                      tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {resourceData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#6366f1' : '#a5b4fc'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Peak hours */}
            <div className="an-chart-card">
              <div className="an-card-header">
                <div>
                  <p className="an-card-title">Peak Booking Hours</p>
                  <p className="an-card-sub">When bookings are most frequently made</p>
                </div>
              </div>
              {hourDataSorted.length === 0 ? (
                <div className="an-empty"><span className="an-empty-icon">📭</span>No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hourDataSorted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9', radius: 6 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {hourDataSorted.map((entry, i) => (
                        <Cell key={i}
                          fill={entry === peakHour ? '#10b981' : '#6ee7b7'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Cancellation & rejection summary */}
            <div className="an-chart-card">
              <div className="an-card-header">
                <div>
                  <p className="an-card-title">Booking Health</p>
                  <p className="an-card-sub">Approval, cancellation and rejection rates</p>
                </div>
              </div>
              {total === 0 ? (
                <div className="an-empty"><span className="an-empty-icon">📭</span>No data</div>
              ) : (
                <div className="an-health-grid">
                  {[
                    { label: "Approval Rate",     key: "APPROVED",  color: "#10b981", bg: "#f0fdf4", icon: "✅" },
                    { label: "Pending Rate",      key: "PENDING",   color: "#f59e0b", bg: "#fffbeb", icon: "⏳" },
                    { label: "Rejection Rate",    key: "REJECTED",  color: "#ef4444", bg: "#fef2f2", icon: "❌" },
                    { label: "Cancellation Rate", key: "CANCELLED", color: "#94a3b8", bg: "#f8fafc", icon: "🚫" },
                  ].map(({ label, key, color, bg, icon }) => {
                    const count = statusCount[key] || 0;
                    const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={key} className="an-health-item" style={{ background: bg, borderColor: color + "33" }}>
                        <span className="an-health-icon">{icon}</span>
                        <div className="an-health-pct" style={{ color }}>{pct}%</div>
                        <div className="an-health-label">{label}</div>
                        <div className="an-health-count">{count} bookings</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
