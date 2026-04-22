import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking, deleteBooking } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getBookingById(id).then(setBooking).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try { setBooking(await cancelBooking(id)); }
    catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionLoading(true);
    try { await deleteBooking(id); navigate('/bookings'); }
    catch (e) { alert(e.message); setActionLoading(false); }
  };

  if (loading) return <p className="text-center text-gray-400 py-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!booking) return null;

  const rows = [
    ['Booking ID', `#${booking.id}`],
    ['Resource ID', booking.resourceId],
    ['User ID', booking.userId],
    ['Email', booking.userEmail],
    ['Date', booking.bookingDate],
    ['Time', `${booking.startTime} – ${booking.endTime}`],
    ['Purpose', booking.purpose],
    ['Attendees', booking.attendees],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="text-indigo-600 text-sm font-medium hover:underline mb-6 inline-block">
          ← Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-600">Booking #{booking.id}</h1>
          <StatusBadge status={booking.status} />
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 border border-indigo-50">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {rows.map(([label, value]) => (
                <tr key={label} className="hover:bg-indigo-50 transition duration-150">
                  <td className="px-6 py-3 text-gray-500 font-medium w-36">{label}</td>
                  <td className="px-6 py-3 text-gray-800">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {booking.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
            <span className="font-semibold">Rejection Reason:</span> {booking.rejectionReason}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {booking.status === 'APPROVED' && (
            <button onClick={handleCancel} disabled={actionLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50">
              Cancel Booking
            </button>
          )}
          <button onClick={handleDelete} disabled={actionLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;
