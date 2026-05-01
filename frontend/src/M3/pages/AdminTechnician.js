import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { getAuthHeader } from '../../M5/authService';
import AdminSidebar from '../../AdminDashboard/AdminSidebar';

const BASE_URL = 'http://localhost:8080/api/admin';

const styles = {
  root:    { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar:  { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '18px 28px' },
  h1:      { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' },
  sub:     { fontSize: 13, color: '#94a3b8', margin: 0 },
  body:    { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 },
  card:    { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  label:   { fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6, display: 'block' },
  input:   { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0f172a', background: '#f8fafc', outline: 'none', width: '100%', transition: 'border-color 0.2s' },
  row:     { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'flex-end' },
  addBtn:  { padding: '10px 22px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' },
  techRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 8 },
  name:    { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  email:   { fontSize: 12, color: '#64748b', marginTop: 2 },
  delBtn:  { padding: '5px 14px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  success: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600 },
  error:   { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 10, padding: '10px 16px', fontSize: 13 },
  empty:   { textAlign: 'center', padding: '32px 20px', color: '#94a3b8', fontSize: 14 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 },
};

const AdminTechnician = () => {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm]               = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading]     = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  useEffect(() => { fetchTechnicians(); }, []);

  const fetchTechnicians = async () => {
    setFetchLoading(true);
    try {
      const data = await ticketApi.getTechnicians();
      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch technicians: ' + err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(
        `${BASE_URL}/technician?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`,
        { method: 'POST', headers: { ...getAuthHeader() } }
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to add technician');
      }
      setForm({ name: '', email: '', password: '' });
      setSuccess(`Technician "${form.name}" added successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      fetchTechnicians();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove technician "${name}"?`)) return;
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to delete technician');
      fetchTechnicians();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.root}>
      <AdminSidebar />
      <div style={styles.main}>

        <div style={styles.topbar}>
          <h1 style={styles.h1}>Manage Technicians</h1>
          <p style={styles.sub}>Register or remove staff members who handle maintenance tickets</p>
        </div>

        <div style={styles.body}>

          {/* ── Add form ── */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Add New Technician</div>
            <form onSubmit={handleAdd}>
              <div style={styles.row}>
                <div>
                  <label style={styles.label}>Full Name</label>
                  <input style={styles.input} placeholder="e.g. John Silva" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={styles.label}>Email</label>
                  <input style={styles.input} type="email" placeholder="tech@sliit.lk" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label style={styles.label}>Password</label>
                  <input style={styles.input} type="password" placeholder="Min. 6 chars" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" style={styles.addBtn} disabled={isLoading}>
                  {isLoading ? 'Adding…' : '+ Add Technician'}
                </button>
              </div>
            </form>

            {success && <div style={{ ...styles.success, marginTop: 14 }}>{success}</div>}
            {error   && <div style={{ ...styles.error,   marginTop: 14 }}>{error}</div>}
          </div>

          {/* ── List ── */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              Registered Technicians ({technicians.length})
            </div>

            {fetchLoading && <div style={styles.empty}>Loading…</div>}

            {!fetchLoading && technicians.length === 0 && (
              <div style={styles.empty}>No technicians registered yet.</div>
            )}

            {!fetchLoading && technicians.map(tech => (
              <div key={tech.id} style={styles.techRow}>
                <div>
                  <div style={styles.name}>{tech.name}</div>
                  <div style={styles.email}>{tech.email}</div>
                </div>
                <button style={styles.delBtn}
                  onClick={() => handleDelete(tech.id, tech.name)}
                  onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
                  onMouseLeave={e => { e.target.style.background = '#fef2f2'; e.target.style.color = '#b91c1c'; }}>
                  Remove
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminTechnician;
