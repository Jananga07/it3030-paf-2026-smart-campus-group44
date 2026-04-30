import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBooking, getAllBookings } from '../api/bookingApi';
import { getResourceById } from '../../M1/api/resourceApi';
import { useAuth } from '../../M5/useAuth';
import './BookingForm.css';

// Hourly time slots 7:00 AM – 9:00 PM
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7;
  const label = hour < 12 ? `${hour}:00 AM` : hour === 12 ? `12:00 PM` : `${hour - 12}:00 PM`;
  const value = `${String(hour).padStart(2, '0')}:00`;
  return { label, value };
});

function TimeSelect({ label, name, value, onChange, bookedHours = [] }) {
  return (
    <div className="bf-field">
      <label className="bf-label">{label}</label>
      <select name={name} value={value} onChange={onChange} required className="bf-input">
        <option value="">Select time</option>
        {TIME_SLOTS.map((t) => {
          const isBooked = bookedHours.includes(t.value);
          return (
            <option key={t.value} value={t.value} disabled={isBooked}>
              {t.label}{isBooked ? ' — Booked' : ''}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, readOnly = false, autoFilled = false, min }) {
  return (
    <div className="bf-field">
      <label className="bf-label">
        {label}
        {autoFilled && <span className="bf-auto-badge">✓ Auto-filled</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required readOnly={readOnly} min={min}
        className={`bf-input${readOnly ? ' bf-input-readonly' : ''}`}
      />
    </div>
  );
}

function BookingForm() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const urlResId  = new URLSearchParams(location.search).get('resourceId') || '';

  const [form, setForm] = useState({
    userId: '', resourceId: urlResId,
    bookingDate: '', startTime: '', endTime: '',
    userEmail: '', purpose: '', attendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [resourceName, setResourceName] = useState('');
  const [resourceCapacity, setResourceCapacity] = useState(null);
  const [bookedHours, setBookedHours]   = useState([]);

  // Fetch resource name when resourceId is known
  useEffect(() => {
    const id = urlResId || form.resourceId;
    if (!id) return;
    getResourceById(id)
      .then(r => { setResourceName(r.name); setResourceCapacity(r.capacity); })
      .catch(() => { setResourceName(''); setResourceCapacity(null); });
  }, [urlResId, form.resourceId]);

  // Fetch booked hours when resource + date are both set
  useEffect(() => {
    const { resourceId, bookingDate } = form;
    if (!resourceId || !bookingDate) { setBookedHours([]); return; }
    getAllBookings()
      .then(all => {
        const taken = all
          .filter(b =>
            String(b.resourceId) === String(resourceId) &&
            b.bookingDate === bookingDate &&
            (b.status === 'APPROVED' || b.status === 'PENDING')
          )
          .flatMap(b => {
            // collect every hour from startTime to endTime (exclusive)
            const start = parseInt(b.startTime?.slice(0, 2), 10);
            const end   = parseInt(b.endTime?.slice(0, 2), 10);
            const hours = [];
            for (let h = start; h < end; h++) hours.push(`${String(h).padStart(2,'0')}:00`);
            return hours;
          });
        setBookedHours([...new Set(taken)]);
      })
      .catch(() => setBookedHours([]));
  }, [form.resourceId, form.bookingDate]);

  useEffect(() => {
    if (user) setForm((p) => ({ ...p, userId: user.id ?? '', userEmail: user.email ?? '' }));
  }, [user]);

  useEffect(() => {
    if (urlResId) setForm((p) => ({ ...p, resourceId: urlResId }));
  }, [urlResId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const parseError   = (msg) => { try { return JSON.parse(msg).error || msg; } catch { return msg; } };
  const isConflict   = (msg) => msg?.toLowerCase().includes('conflict');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (resourceCapacity && Number(form.attendees) > resourceCapacity) {
      setError(`Attendees (${form.attendees}) exceeds this resource's capacity of ${resourceCapacity} people.`);
      setLoading(false);
      return;
    }
    try {
      await createBooking({
        ...form,
        userId: Number(form.userId), resourceId: Number(form.resourceId), attendees: Number(form.attendees),
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(parseError(err.message) || 'Failed to create booking');
    } finally { setLoading(false); }
  };

  return (
    <div className="bf-page">
      <div className="bf-container">

        <button className="bf-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="bf-header">
          <h1>📅 New Booking</h1>
          <p>Fill in the details below to request a campus resource.</p>
        </div>

        {error && (
          <div className={`bf-alert ${isConflict(error) ? 'bf-alert-warning' : 'bf-alert-danger'}`}
            style={{ marginBottom: 16 }}>
            <span className="bf-alert-icon">{isConflict(error) ? '⚠️' : '❌'}</span>
            <div>
              <div className="bf-alert-title">
                {isConflict(error) ? 'Time Slot Already Booked' : 'Booking Failed'}
              </div>
              <div className="bf-alert-msg">
                {isConflict(error)
                  ? `Resource ${form.resourceId} is already booked on ${form.bookingDate} from ${form.startTime} to ${form.endTime}.`
                  : error}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bf-card">

            <div className="bf-section">
              <div className="bf-section-title">👤 Your Details</div>
              <div className="bf-row">
                <Field label="User ID" name="userId" type="number" value={form.userId} onChange={handleChange} readOnly autoFilled />
                <Field label="Email" name="userEmail" type="email" value={form.userEmail} onChange={handleChange} readOnly autoFilled />
              </div>
            </div>

            <div className="bf-section">
              <div className="bf-section-title">🏢 Resource</div>
              <Field label="Resource ID" name="resourceId" type="number" value={form.resourceId}
                onChange={handleChange} readOnly={Boolean(urlResId)} autoFilled={Boolean(urlResId)} />
              {resourceName && (
                <div className="bf-resource-name">
                  🏫 <strong>{resourceName}</strong>
                </div>
              )}
            </div>

            <div className="bf-section">
              <div className="bf-section-title">📅 Date &amp; Time</div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <Field label="Booking Date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                <div className="bf-row">
                  <TimeSelect label="Start Time" name="startTime" value={form.startTime} onChange={handleChange} bookedHours={bookedHours} />
                  <TimeSelect label="End Time"   name="endTime"   value={form.endTime}   onChange={handleChange} bookedHours={bookedHours} />
                </div>
              </div>
            </div>

            <div className="bf-section">
              <div className="bf-section-title">📝 Booking Details</div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <Field label="Purpose"             name="purpose"   value={form.purpose}   onChange={handleChange} />
                <Field label="Number of Attendees" name="attendees" type="number" value={form.attendees} onChange={handleChange} />
                {resourceCapacity && form.attendees && Number(form.attendees) > resourceCapacity && (
                  <div className="bf-capacity-warn">
                    ⚠ Exceeds capacity — max {resourceCapacity} people allowed
                  </div>
                )}
                {resourceCapacity && (
                  <div className="bf-capacity-hint">
                    Max capacity: {resourceCapacity} people
                  </div>
                )}
              </div>
            </div>

            <div className="bf-submit-section">
              <span className="bf-submit-hint">Your booking will be reviewed by an admin.</span>
              <button type="submit" disabled={loading} className="bf-submit-btn">
                {loading ? '⏳ Submitting…' : '📤 Submit Booking Request'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
