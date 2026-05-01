import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBookingsByUser } from '../api/bookingApi';
import { getAllResources } from '../../M1/api/resourceApi';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../../M5/useAuth';
import './MyBookings.css';

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function MyBookings() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [resourceMap, setResourceMap] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('ALL');

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    setError('');
    Promise.all([
      getBookingsByUser(user.id),
      getAllResources(),
    ])
      .then(([bookingData, resourceData]) => {
        setBookings(bookingData);
        const map = {};
        resourceData.forEach(r => { map[r.id] = r.name; });
        setResourceMap(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const displayed = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const statusClass = (status) => {
    const map = {
      PENDING:   'mb-card-pending',
      APPROVED:  'mb-card-approved',
      REJECTED:  'mb-card-rejected',
      CANCELLED: 'mb-card-cancelled',
    };
    return map[status] || '';
  };

  if (!user) return (
    <div className="mb-page">
      <div className="mb-empty">
        <span className="mb-empty-icon">🔐</span>
        <h3>Login Required</h3>
        <p>Please sign in to view your bookings.</p>
        <button className="mb-new-btn" onClick={() => navigate('/login')}
          style={{ marginTop: 16 }}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="mb-page">

      {/* ── Header ── */}
      <div className="mb-header">
        <div className="mb-header-left">
          <h1>My Bookings</h1>
          <p>All bookings made by {user.name}</p>
        </div>
        <Link to="/book" className="mb-new-btn">+ New Booking</Link>
      </div>

      {/* ── Filter tabs ── */}
      <div className="mb-filters">
        {FILTERS.map((f) => {
          const count = f === 'ALL' ? bookings.length : bookings.filter(b => b.status === f).length;
          return (
            <button key={f}
              className={`mb-filter-btn${filter === f ? ' mb-filter-btn-active' : ''}`}
              onClick={() => setFilter(f)}>
              {f} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* ── States ── */}
      {loading && <div className="mb-loading">⏳ Loading your bookings…</div>}
      {error   && <div className="mb-error">⚠ {error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="mb-empty">
          <span className="mb-empty-icon">📭</span>
          <h3>No bookings yet</h3>
          <p>You haven't made any bookings. Start by booking a resource.</p>
          <Link to="/book" className="mb-new-btn" style={{ marginTop: 16, display: 'inline-flex' }}>
            + Book a Resource
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && displayed.length === 0 && (
        <div className="mb-empty">
          <span className="mb-empty-icon">🔍</span>
          <h3>No {filter.toLowerCase()} bookings</h3>
          <p>You have no bookings with this status.</p>
        </div>
      )}

      {!loading && !error && displayed.length > 0 && (
        <>
          <p className="mb-count">{displayed.length} booking{displayed.length !== 1 ? 's' : ''}</p>
          <div className="mb-grid">
            {displayed.map((b) => (
              <div key={b.id} className={`mb-card ${statusClass(b.status)}`}>

                <div className="mb-card-header">
                  <span className="mb-card-id">Booking #{b.id}</span>
                  <StatusBadge status={b.status} />
                </div>

                <div className="mb-card-info">
                  <div className="mb-info-row">
                    <span className="mb-info-icon">🏢</span>
                    <span className="mb-info-label">Resource</span>
                    <span className="mb-info-value">
                      {resourceMap[b.resourceId] || `Resource #${b.resourceId}`}
                    </span>
                  </div>
                  <div className="mb-info-row">
                    <span className="mb-info-icon">📅</span>
                    <span className="mb-info-label">Date</span>
                    <span className="mb-info-value">{b.bookingDate}</span>
                  </div>
                  <div className="mb-info-row">
                    <span className="mb-info-icon">⏰</span>
                    <span className="mb-info-label">Time</span>
                    <span className="mb-info-value">{b.startTime} – {b.endTime}</span>
                  </div>
                  <div className="mb-info-row">
                    <span className="mb-info-icon">👥</span>
                    <span className="mb-info-label">Attendees</span>
                    <span className="mb-info-value">{b.attendees}</span>
                  </div>
                  <div className="mb-info-row">
                    <span className="mb-info-icon">📝</span>
                    <span className="mb-info-label">Purpose</span>
                    <span className="mb-info-value">{b.purpose}</span>
                  </div>
                </div>

                {b.rejectionReason && (
                  <div className="mb-rejection">
                    ❌ Rejection reason: {b.rejectionReason}
                  </div>
                )}

                <div className="mb-card-footer">
                  <Link to={`/bookings/${b.id}`} className="mb-card-link">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyBookings;
