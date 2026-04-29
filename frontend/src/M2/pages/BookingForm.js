import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { useAuth } from '../../M5/useAuth';

function Field({ label, name, type = 'text', value, onChange, readOnly = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} required
        readOnly={readOnly}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
          readOnly ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold cursor-not-allowed' : 'border-gray-300'
        }`}
      />
    </div>
  );
}

function BookingForm() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Read ?resourceId= from URL (set by the Book button on ResourceCard)
  const params     = new URLSearchParams(location.search);
  const urlResId   = params.get('resourceId') || '';

  const [form, setForm] = useState({
    userId: '', resourceId: urlResId,
    bookingDate: '', startTime: '', endTime: '',
    userEmail: '', purpose: '', attendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Auto-fill userId and email from logged-in user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        userId:    user.id    ?? '',
        userEmail: user.email ?? '',
      }));
    }
  }, [user]);

  // If resourceId changes in URL after mount, sync it
  useEffect(() => {
    if (urlResId) {
      setForm((prev) => ({ ...prev, resourceId: urlResId }));
    }
  }, [urlResId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const parseError = (msg) => {
    try { return JSON.parse(msg).error || msg; } catch { return msg; }
  };

  const isConflict = (msg) => msg?.toLowerCase().includes('conflict');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createBooking({
        ...form,
        userId:     Number(form.userId),
        resourceId: Number(form.resourceId),
        attendees:  Number(form.attendees),
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(parseError(err.message) || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-1">New Booking</h1>
        <p className="text-gray-500 mb-8 text-sm">Fill in the details to request a campus resource.</p>

        {error && (
          <div className={`rounded-xl px-5 py-4 mb-6 flex gap-3 items-start border ${
            isConflict(error) ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'
          }`}>
            <span className="text-xl">{isConflict(error) ? '⚠️' : '❌'}</span>
            <div>
              <p className={`font-semibold text-sm ${isConflict(error) ? 'text-orange-700' : 'text-red-700'}`}>
                {isConflict(error) ? 'Time Slot Already Booked' : 'Booking Failed'}
              </p>
              <p className={`text-sm mt-1 ${isConflict(error) ? 'text-orange-600' : 'text-red-600'}`}>
                {isConflict(error)
                  ? `Resource ${form.resourceId} is already booked on ${form.bookingDate} from ${form.startTime} to ${form.endTime}.`
                  : error}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5 border border-indigo-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="User ID"     name="userId"     type="number" value={form.userId}     onChange={handleChange} readOnly />
            <Field label="Resource ID" name="resourceId" type="number" value={form.resourceId} onChange={handleChange} readOnly={Boolean(urlResId)} />
          </div>
          <Field label="Email" name="userEmail" type="email" value={form.userEmail} onChange={handleChange} readOnly />
          <Field label="Booking Date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
            <Field label="End Time"   name="endTime"   type="time" value={form.endTime}   onChange={handleChange} />
          </div>
          <Field label="Purpose" name="purpose" value={form.purpose} onChange={handleChange} />
          <Field label="Number of Attendees" name="attendees" type="number" value={form.attendees} onChange={handleChange} />

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 shadow-md">
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
