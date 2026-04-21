import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBookings, getBookingsByUser } from '../api/bookingApi';
import StatusBadge from '../components/StatusBadge';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setLoading(true);
      getAllBookings().then(setBookings).catch((e) => setError(e.message)).finally(() => setLoading(false));
      return;
    }
    setSearching(true);
    setError('');
    try { setBookings(await getBookingsByUser(userId)); }
    catch (err) { setError(err.message); }
    finally { setSearching(false); }
  };

  const handleClear = () => {
    setUserId('');
    setLoading(true);
    setError('');
    getAllBookings().then(setBookings).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-1">My Bookings</h1>
        <p className="text-gray-500 text-sm mb-8">All bookings shown below. Search by User ID to filter.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8 flex-wrap">
          <input
            type="number" placeholder="Search by User ID..."
            value={userId} onChange={(e) => setUserId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
          />
          <button type="submit" disabled={searching}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
            {searching ? 'Searching...' : 'Search'}
          </button>
          {userId && (
            <button type="button" onClick={handleClear}
              className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              Clear
            </button>
          )}
        </form>

        {loading && <p className="text-center text-gray-400 py-16">Loading...</p>}
        {error && <p className="text-center text-red-500 py-16">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-center text-gray-400 py-16">No bookings found.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">{bookings.length} booking(s) found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl shadow-md p-5 border border-indigo-50 hover:shadow-lg transition duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800 text-sm">Booking #{b.id}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p>📅 {b.bookingDate}</p>
                    <p>⏰ {b.startTime} – {b.endTime}</p>
                    <p>🏢 Resource: {b.resourceId}</p>
                    <p>👤 User: {b.userId}</p>
                    <p className="truncate">📝 {b.purpose}</p>
                  </div>
                  {b.rejectionReason && (
                    <p className="text-xs text-red-500 mb-3">Reason: {b.rejectionReason}</p>
                  )}
                  <Link to={`/bookings/${b.id}`} className="text-indigo-600 text-xs font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
