import React, { useEffect, useState, useCallback } from 'react';
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';
import AdminSidebar from '../../AdminDashboard/AdminSidebar';
import './AdminPanel.css';

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const TAB_META = {
  ALL:       { icon: '📋', cls: 'ap-sum-icon-all' },
  PENDING:   { icon: '⏳', cls: 'ap-sum-icon-pending' },
  APPROVED:  { icon: '✅', cls: 'ap-sum-icon-approved' },
  REJECTED:  { icon: '❌', cls: 'ap-sum-icon-rejected' },
  CANCELLED: { icon: '🚫', cls: 'ap-sum-icon-cancelled' },
};

function AdminPanel() {
  const [allBookings, setAllBookings]   = useState([]);
  const [tab, setTab]                   = useState('ALL');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [rejectModal, setRejectModal]   = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    getAllBookings(null)
      .then(setAllBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'ALL' ? allBookings.length : allBookings.filter(b => b.status === t).length;
    return acc;
  }, {});

  const displayed = tab === 'ALL' ? allBookings : allBookings.filter(b => b.status === tab);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { await approveBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert('Please enter a rejection reason.');
    setActionLoading(true);
    try {
      await rejectBooking(rejectModal, rejectReason);
      setRejectModal(null); setRejectReason('');
      fetchBookings();
    }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try { await cancelBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try { await deleteBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="ap-root">
      <AdminSidebar />

      <div className="ap-main">

        {/* ── Top bar ── */}
        <div className="ap-topbar">
          <div>
            <h1>Booking Management</h1>
            <p>Review, approve and manage all campus resource bookings</p>
          </div>
          <div className="ap-topbar-right">
            <button className="ap-refresh-btn" onClick={fetchBookings}>↺ Refresh</button>
          </div>
        </div>

        <div className="ap-body">

          {/* ── Summary filter cards ── */}
          <div className="ap-summary">
            {TABS.map((t) => (
              <div key={t}
                className={`ap-sum-card${tab === t ? ' ap-sum-card-active' : ''}`}
                onClick={() => setTab(t)}>
                <div className={`ap-sum-icon ${TAB_META[t].cls}`}>{TAB_META[t].icon}</div>
                <div>
                  <div className="ap-sum-value">{counts[t] ?? 0}</div>
                  <div className="ap-sum-label">{t}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Table ── */}
          <div className="ap-table-card">
            <div className="ap-table-header">
              <span className="ap-table-title">
                {tab === 'ALL' ? 'All Bookings' : `${tab} Bookings`}
              </span>
              <span className="ap-table-count">
                {displayed.length} record{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="ap-empty"><span className="ap-empty-icon">⏳</span>Loading…</div>
            )}
            {error && (
              <div className="ap-empty" style={{ color: '#ef4444' }}>{error}</div>
            )}
            {!loading && !error && displayed.length === 0 && (
              <div className="ap-empty">
                <span className="ap-empty-icon">📭</span>
                No {tab !== 'ALL' ? tab.toLowerCase() + ' ' : ''}bookings found.
              </div>
            )}

            {!loading && !error && displayed.length > 0 && (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      {['ID', 'Resource', 'User', 'Email', 'Date', 'Time', 'Purpose', 'Attendees', 'Status', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((b) => (
                      <tr key={b.id}>
                        <td className="ap-table-id">#{b.id}</td>
                        <td>{b.resourceId}</td>
                        <td>{b.userId}</td>
                        <td>{b.userEmail}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{b.bookingDate}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                        <td className="ap-table-truncate">{b.purpose}</td>
                        <td>{b.attendees}</td>
                        <td><StatusBadge status={b.status} /></td>
                        <td>
                          <div className="ap-actions">
                            {b.status === 'PENDING' && (
                              <>
                                <button className="ap-btn ap-btn-approve" disabled={actionLoading}
                                  onClick={() => handleApprove(b.id)}>Approve</button>
                                <button className="ap-btn ap-btn-reject" disabled={actionLoading}
                                  onClick={() => { setRejectModal(b.id); setRejectReason(''); }}>Reject</button>
                              </>
                            )}
                            {b.status === 'APPROVED' && (
                              <button className="ap-btn ap-btn-cancel" disabled={actionLoading}
                                onClick={() => handleCancel(b.id)}>Cancel</button>
                            )}
                            <button className="ap-btn ap-btn-delete" disabled={actionLoading}
                              onClick={() => handleDelete(b.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Reject modal ── */}
      {rejectModal && (
        <div className="ap-modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Booking #{rejectModal}</h2>
            <textarea
              rows={3}
              placeholder="Enter rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="ap-modal-actions">
              <button className="ap-modal-btn ap-modal-btn-confirm"
                onClick={handleReject} disabled={actionLoading}>
                Confirm Reject
              </button>
              <button className="ap-modal-btn ap-modal-btn-cancel"
                onClick={() => setRejectModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
