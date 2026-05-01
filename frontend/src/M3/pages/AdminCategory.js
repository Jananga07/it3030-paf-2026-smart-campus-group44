import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../AdminDashboard/AdminSidebar';

const s = {
  root:     { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main:     { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar:   { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  h1:       { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' },
  sub:      { fontSize: 13, color: '#94a3b8', margin: 0 },
  body:     { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 },
  card:     { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  secTitle: { fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 },
  label:    { fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6, display: 'block' },
  inputRow: { display: 'flex', gap: 12 },
  input:    { flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, fontFamily: 'inherit', color: '#0f172a', background: '#f8fafc', outline: 'none' },
  addBtn:   { padding: '10px 22px', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' },
  catRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 8 },
  catName:  { fontSize: 14, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 },
  catIcon:  { fontSize: 16 },
  delBtn:   { padding: '5px 14px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  success:  { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600 },
  error:    { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 10, padding: '10px 16px', fontSize: 13 },
  empty:    { textAlign: 'center', padding: '28px 20px', color: '#94a3b8', fontSize: 14 },
  countBadge: { fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: 20 },
};

const CATEGORY_ICONS = ['🔧', '💻', '🏫', '⚡', '🌐', '📋', '🔬', '🎯', '🛠️', '📡'];

const AdminCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setFetchLoading(true);
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch { setError('Failed to fetch categories'); }
    finally { setFetchLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setIsLoading(true); setError(''); setSuccess('');
    try {
      await categoryApi.addCategory(trimmed);
      setNewCategory('');
      setSuccess(`"${trimmed}" added successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to add category');
    } finally { setIsLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryApi.deleteCategory(id);
      fetchCategories();
    } catch { setError('Failed to delete category'); }
  };

  return (
    <div style={s.root}>
      <AdminSidebar />
      <div style={s.main}>

        <div style={s.topbar}>
          <div>
            <h1 style={s.h1}>🗂 Manage Categories</h1>
            <p style={s.sub}>Add or remove ticket categories for the support desk</p>
          </div>
          <button style={{ ...s.addBtn, background: 'linear-gradient(135deg,#64748b,#475569)' }}
            onClick={() => navigate('/tickets')}>
            🎫 View All Tickets
          </button>
          <button style={{ ...s.addBtn, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' }}
            onClick={() => navigate('/admin/technicians')}>
            👷 Manage Technicians
          </button>
        </div>

        <div style={s.body}>

          {/* ── Add form ── */}
          <div style={s.card}>
            <div style={s.secTitle}>Add New Category</div>
            <form onSubmit={handleAdd}>
              <label style={s.label}>Category Name</label>
              <div style={s.inputRow}>
                <input
                  style={s.input}
                  placeholder="e.g., Hardware Issue, Software Bug, Lab Equipment"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  required
                />
                <button type="submit" style={s.addBtn} disabled={isLoading}>
                  {isLoading ? 'Adding…' : '+ Add Category'}
                </button>
              </div>
            </form>
            {success && <div style={{ ...s.success, marginTop: 14 }}>{success}</div>}
            {error   && <div style={{ ...s.error,   marginTop: 14 }}>{error}</div>}
          </div>

          {/* ── List ── */}
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={s.secTitle}>Existing Categories</div>
              <span style={s.countBadge}>{categories.length} total</span>
            </div>

            {fetchLoading && <div style={s.empty}>Loading…</div>}

            {!fetchLoading && categories.length === 0 && (
              <div style={s.empty}>No categories added yet.</div>
            )}

            <AnimatePresence>
              {categories.map((cat, i) => (
                <motion.div key={cat.id}
                  style={s.catRow}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}>
                  <div style={s.catName}>
                    <span style={s.catIcon}>{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</span>
                    {cat.name}
                  </div>
                  <button style={s.delBtn}
                    onClick={() => handleDelete(cat.id, cat.name)}
                    onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
                    onMouseLeave={e => { e.target.style.background = '#fef2f2'; e.target.style.color = '#b91c1c'; }}>
                    Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminCategory;
