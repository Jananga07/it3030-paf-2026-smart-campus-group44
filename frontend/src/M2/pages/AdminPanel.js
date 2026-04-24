import React, { useEffect, useState, useCallback } from 'react';
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    getAllBookings(tab === 'ALL' ? null : tab)
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try { await approveBooking(id); fetchBookings(); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert('Please enter a rejection reason.');
    setActionLoading(true);
    try { await rejectBooking(rejectModal, rejectReason); setRejectModal(null); setRejectReason(''); fetchBookings(); }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-1">Admin Panel</h1>
        <p className="text-gray-500 text-sm mb-8">Manage all campus resource bookings.</p>

        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition duration-200 ${
                tab === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-400 py-16">Loading...</p>}
        {error && <p className="text-center text-red-500 py-16">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-400">No bookings found.</p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="overflow-x-auto rounded-2xl shadow-md border border-indigo-50">
            <table className="w-full bg-white text-sm">
              <thead className="bg-indigo-50 text-indigo-600 text-xs uppercase tracking-wider">
                <tr>
                  {['ID', 'Resource', 'Email', 'Date', 'Time', 'Purpose', 'Attendees', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-indigo-50 transition duration-150">
                    <td className="px-4 py-3 font-semibold text-gray-800">#{b.id}</td>
                    <td className="px-4 py-3 text-gray-600">{b.resourceId}</td>
                    <td className="px-4 py-3 text-gray-600">{b.userEmail}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.bookingDate}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{b.purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{b.attendees}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {b.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleApprove(b.id)} disabled={actionLoading}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                              Approve
                            </button>
                            <button onClick={() => { setRejectModal(b.id); setRejectReason(''); }} disabled={actionLoading}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === 'APPROVED' && (
                          <button onClick={() => handleCancel(b.id)} disabled={actionLoading}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                            Cancel
                          </button>
                        )}
                        <button onClick={() => handleDelete(b.id)} disabled={actionLoading}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold transition disabled:opacity-50">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Reject Booking #{rejectModal}</h2>
            <textarea rows={3} placeholder="Enter rejection reason..."
              value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 resize-none" />
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
                Confirm Reject
              </button>
              <button onClick={() => setRejectModal(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition">
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
