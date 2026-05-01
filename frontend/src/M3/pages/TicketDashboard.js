import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../M5/useAuth';
import { ticketApi } from '../api/client';
import { motion } from 'framer-motion';
import '../styles/module3.css';
import '../styles/ticket-dashboard.css';

const STATUS_CONFIG = {
  OPEN:        { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'Open' },
  IN_PROGRESS: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'In Progress' },
  RESOLVED:    { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', label: 'Resolved' },
  REJECTED:    { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Rejected' },
  CLOSED:      { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', label: 'Closed' },
};

const PRIORITY_CONFIG = {
  High:   { color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
  Medium: { color: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b' },
  Low:    { color: '#22c55e', bg: '#f0fdf4', dot: '#22c55e' },
};

const FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'];

const TicketDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('ALL');
  const navigate = useNavigate();

  const fetchTickets = React.useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await ticketApi.getAllTickets(user.id);
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load tickets.');
      setTickets([]);
    } finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchTickets();
    else setLoading(false);
  }, [user, fetchTickets]);

  if (!user) return (
    <div className="td-page">
      <div className="td-login-prompt">
        <div className="td-login-icon">🎫</div>
        <h2>Login Required</h2>
        <p>Please sign in to view your tickets.</p>
        <button className="td-btn td-btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    </div>
  );

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'ALL' ? tickets.length : tickets.filter(t => t.status === f).length;
    return acc;
  }, {});

  const displayed = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="td-page">

      {/* ── Header ── */}
      <div className="td-header">
        <div className="td-header-left">
          <h1 className="td-title">🎫 Support Desk</h1>
          <p className="td-subtitle">Welcome back, <strong>{user.name}</strong></p>
        </div>
        <div className="td-header-actions">
          {user.role === 'ADMIN' && (
            <>
              <button className="td-btn td-btn-outline"
                onClick={() => navigate('/admin/ticket-categories')}>
                🗂 Categories
              </button>
              <button className="td-btn td-btn-outline"
                onClick={() => navigate('/admin/technicians')}>
                👷 Technicians
              </button>
            </>
          )}
          <button className="td-btn td-btn-primary"
            onClick={() => navigate('/tickets/create')}>
            + New Ticket
          </button>
        </div>
      </div>

      {/* ── Status filter cards ── */}
      <div className="td-status-row">
        {FILTERS.map(f => {
          const cfg = f === 'ALL' ? null : STATUS_CONFIG[f];
          return (
            <button key={f}
              className={`td-status-card${filter === f ? ' td-status-card-active' : ''}`}
              onClick={() => setFilter(f)}
              style={filter === f && cfg ? { borderColor: cfg.color, background: cfg.bg } : {}}>
              <div className="td-status-count"
                style={filter === f && cfg ? { color: cfg.color } : {}}>
                {counts[f] ?? 0}
              </div>
              <div className="td-status-label">
                {f === 'ALL' ? 'All' : STATUS_CONFIG[f]?.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Error ── */}
      {error && <div className="td-error">{error}</div>}

      {/* ── Loading ── */}
      {loading && (
        <div className="td-grid">
          {[1,2,3,4,5,6].map(n => <div key={n} className="td-skeleton" />)}
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && displayed.length === 0 && (
        <div className="td-empty">
          <div className="td-empty-icon">📭</div>
          <h3>No tickets found</h3>
          <p>{filter !== 'ALL' ? `No ${STATUS_CONFIG[filter]?.label} tickets.` : 'Create your first ticket!'}</p>
          <button className="td-btn td-btn-primary" onClick={() => navigate('/tickets/create')}>
            + Create Ticket
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && displayed.length > 0 && (
        <>
          <p className="td-count">{displayed.length} ticket{displayed.length !== 1 ? 's' : ''}</p>
          <div className="td-grid">
            {displayed.map((ticket, i) => {
              const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
              const pc = PRIORITY_CONFIG[ticket.priorityLevel] || PRIORITY_CONFIG.Medium;
              return (
                <motion.div key={ticket.id} className="td-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}>

                  {/* Top accent bar */}
                  <div className="td-card-accent" style={{ background: sc.color }} />

                  {/* Badges row */}
                  <div className="td-card-badges">
                    <span className="td-status-badge"
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {sc.label}
                    </span>
                    <span className="td-priority-badge"
                      style={{ background: pc.bg, color: pc.color }}>
                      <span className="td-priority-dot" style={{ background: pc.dot }} />
                      {ticket.priorityLevel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="td-card-title">
                    {ticket.title || `Ticket #${ticket.id}`}
                  </h3>

                  {/* Category */}
                  <div className="td-card-category">{ticket.category}</div>

                  {/* Description */}
                  <p className="td-card-desc">{ticket.description}</p>

                  {/* Footer */}
                  <div className="td-card-footer">
                    <span>📍 {ticket.location}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default TicketDashboard;
