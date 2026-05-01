import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../M5/useAuth';
import { ticketApi, categoryApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ticket-dashboard.css';
import '../styles/create-ticket.css';

const PRIORITY_OPTIONS = [
  { value: 'High',   label: '🔴 High',   color: '#ef4444', bg: '#fef2f2' },
  { value: 'Medium', label: '🟡 Medium', color: '#f59e0b', bg: '#fffbeb' },
  { value: 'Low',    label: '🟢 Low',    color: '#22c55e', bg: '#f0fdf4' },
];

const CreateTicket = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [formData, setFormData] = useState({
    title: '', priority: 'Medium', category: '',
    location: '', email: user?.email || '',
    contactInfo: '', description: '',
  });
  const [categories, setCategories]   = useState([]);
  const [files, setFiles]             = useState([]);
  const [previews, setPreviews]       = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    categoryApi.getAllCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.email) setFormData(p => ({ ...p, email: user.email }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 3) { alert('Maximum 3 images allowed'); return; }
    const valid = selected.filter(f => {
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext) && f.size <= 5 * 1024 * 1024;
    });
    setFiles(p => [...p, ...valid]);
    setPreviews(p => [...p, ...valid.map(f => URL.createObjectURL(f))]);
  };

  const removeFile = (i) => {
    URL.revokeObjectURL(previews[i]);
    setFiles(p => p.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 10) { setError('Description must be at least 10 characters.'); return; }
    setIsSubmitting(true); setError('');
    const data = new FormData();
    data.append('userId', user.id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('email', formData.email);
    data.append('contactInfo', formData.contactInfo);
    data.append('priorityLevel', formData.priority);
    files.forEach(f => data.append('evidences', f));
    try {
      await ticketApi.createTicket(data);
      navigate('/tickets');
    } catch (err) {
      setError(err.message);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="ct-page">
      <div className="ct-container">

        {/* ── Header ── */}
        <motion.div className="ct-header"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <button className="ct-back" onClick={() => navigate('/tickets')}>← Back</button>
          <div>
            <h1 className="ct-title">🎫 Create New Ticket</h1>
            <p className="ct-sub">Fill out the form below to submit a support request</p>
          </div>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="ct-form"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>

          {/* ── Section 1: Basic Info ── */}
          <div className="ct-section">
            <div className="ct-section-title">📋 Basic Information</div>

            <div className="ct-field">
              <label className="ct-label">Ticket Title <span className="ct-req">*</span></label>
              <input name="title" className="ct-input"
                placeholder="Brief title describing the issue"
                value={formData.title} onChange={handleChange} required />
            </div>

            <div className="ct-row">
              {/* Priority selector */}
              <div className="ct-field">
                <label className="ct-label">Priority <span className="ct-req">*</span></label>
                <div className="ct-priority-group">
                  {PRIORITY_OPTIONS.map(p => (
                    <button key={p.value} type="button"
                      className={`ct-priority-btn${formData.priority === p.value ? ' ct-priority-active' : ''}`}
                      style={formData.priority === p.value ? { background: p.bg, borderColor: p.color, color: p.color } : {}}
                      onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Category <span className="ct-req">*</span></label>
                <select name="category" className="ct-input"
                  value={formData.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 2: Location & Contact ── */}
          <div className="ct-section">
            <div className="ct-section-title">📍 Location & Contact</div>
            <div className="ct-row">
              <div className="ct-field">
                <label className="ct-label">Location / Resource <span className="ct-req">*</span></label>
                <input name="location" className="ct-input"
                  placeholder="e.g. Room 101, Lab A, Server Room"
                  value={formData.location} onChange={handleChange} required />
              </div>
              <div className="ct-field">
                <label className="ct-label">Email <span className="ct-req">*</span></label>
                <input name="email" type="email" className="ct-input ct-input-auto"
                  value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="ct-field">
              <label className="ct-label">Contact Info <span className="ct-req">*</span></label>
              <input name="contactInfo" className="ct-input"
                placeholder="Phone number or alternative contact"
                value={formData.contactInfo} onChange={handleChange} required />
            </div>
          </div>

          {/* ── Section 3: Description ── */}
          <div className="ct-section">
            <div className="ct-section-title">📝 Description</div>
            <div className="ct-field">
              <label className="ct-label">Describe the issue <span className="ct-req">*</span></label>
              <textarea name="description" className="ct-input ct-textarea"
                rows={5}
                placeholder="Provide detailed information about your issue or request (min. 10 characters)"
                value={formData.description} onChange={handleChange}
                maxLength={1000} required />
              <div className="ct-char-count">{formData.description.length} / 1000</div>
            </div>
          </div>

          {/* ── Section 4: Attachments ── */}
          <div className="ct-section">
            <div className="ct-section-title">📎 Attachments <span className="ct-optional">(optional, max 3)</span></div>
            <div className="ct-upload-zone" onClick={() => document.getElementById('ct-file').click()}>
              <div className="ct-upload-icon">📁</div>
              <div className="ct-upload-text">Click to upload images</div>
              <div className="ct-upload-hint">JPG, JPEG, PNG — max 5MB each</div>
              <input id="ct-file" type="file" multiple accept=".jpg,.jpeg,.png"
                onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            {previews.length > 0 && (
              <div className="ct-previews">
                <AnimatePresence>
                  {previews.map((src, i) => (
                    <motion.div key={src} className="ct-preview"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}>
                      <img src={src} alt="preview" />
                      <button type="button" className="ct-preview-remove"
                        onClick={() => removeFile(i)}>×</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="ct-error">{error}</div>
          )}

          {/* ── Actions ── */}
          <div className="ct-actions">
            <button type="button" className="ct-btn-cancel"
              onClick={() => navigate('/tickets')}>
              Cancel
            </button>
            <button type="submit" className="ct-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Submitting…' : '📤 Submit Ticket'}
            </button>
          </div>

        </motion.form>
      </div>
    </div>
  );
};

export default CreateTicket;
