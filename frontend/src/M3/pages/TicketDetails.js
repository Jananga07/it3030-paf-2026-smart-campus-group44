import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../M5/useAuth';
import { ticketApi, commentApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ticket-details.css';

const STATUS_CFG = {
  OPEN:        { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  IN_PROGRESS: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  RESOLVED:    { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  REJECTED:    { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  CLOSED:      { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
};

const PRIORITY_CFG = {
  High:   { color: '#ef4444', bg: '#fef2f2', dot: '#ef4444' },
  Medium: { color: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b' },
  Low:    { color: '#22c55e', bg: '#f0fdf4', dot: '#22c55e' },
};

const TicketDetails = () => {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket]                   = useState(null);
  const [comments, setComments]               = useState([]);
  const [newComment, setNewComment]           = useState('');
  const [editingId, setEditingId]             = useState(null);
  const [editingText, setEditingText]         = useState('');
  const [isUpdating, setIsUpdating]           = useState(false);
  const [statusNote, setStatusNote]           = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(null);
  const [technicians, setTechnicians]         = useState([]);
  const [selectedTechId, setSelectedTechId]   = useState('');
  const [resNotes, setResNotes]               = useState('');
  const [isAddingRes, setIsAddingRes]         = useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const [ticketData, commentsData] = await Promise.all([
        ticketApi.getTicketById(id),
        commentApi.getComments(id),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setResNotes(ticketData.resolutionNotes || '');
      if (user?.role === 'ADMIN') {
        const techData = await ticketApi.getTechnicians();
        setTechnicians(techData);
      }
    } catch { navigate('/tickets'); }
  }, [id, user.role, navigate]);

  useEffect(() => { if (user?.id) fetchData(); }, [fetchData, user]);

  const handleStatusChange = async () => {
    if (!statusNote.trim()) { alert('Please provide a reason.'); return; }
    setIsUpdating(true);
    try {
      await ticketApi.updateStatus(id, showStatusConfirm, statusNote, user.id);
      setShowStatusConfirm(null); setStatusNote('');
      await fetchData();
    } catch (e) { alert(e.message); }
    finally { setIsUpdating(false); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try { await commentApi.addComment(id, user.id, newComment); setNewComment(''); fetchData(); }
    catch (e) { alert(e.message); }
  };

  const handleEditComment = async (cid) => {
    if (!editingText.trim()) return;
    try { await commentApi.updateComment(cid, user.id, editingText); setEditingId(null); setEditingText(''); await fetchData(); }
    catch (e) { alert(e.message); }
  };

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await commentApi.deleteComment(cid, user.id); await fetchData(); }
    catch (e) { alert(e.message); }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Permanently delete this ticket?')) return;
    try { await ticketApi.deleteTicket(id, user.id); navigate('/tickets'); }
    catch (e) { alert(e.message); }
  };

  const handleAssignTech = async () => {
    if (!selectedTechId) return;
    try { await ticketApi.assignTechnician(id, selectedTechId, user.id); await fetchData(); }
    catch (e) { alert(e.message); }
  };

  const handleAddResolution = async () => {
    if (!resNotes.trim()) return;
    setIsAddingRes(true);
    try { await ticketApi.addResolutionNotes(id, resNotes, user.id); await fetchData(); }
    catch (e) { alert(e.message); }
    finally { setIsAddingRes(false); }
  };

  if (!ticket) return <div className="td2-page"><div className="td2-container">Loading…</div></div>;
  if (!user)   return <div className="td2-page"><div className="td2-container">Loading…</div></div>;

  const sc = STATUS_CFG[ticket.status] || STATUS_CFG.OPEN;
  const pc = PRIORITY_CFG[ticket.priorityLevel] || PRIORITY_CFG.Medium;
  const canManage = user.role === 'ADMIN' ||
    (user.role === 'TECHNICIAN' && ticket.assignedTechnicianId && String(ticket.assignedTechnicianId) === String(user.id));

  return (
    <div className="td2-page">
      <div className="td2-container">

        <button className="td2-back" onClick={() => navigate('/tickets')}>← Back to Dashboard</button>

        {/* ── Main card ── */}
        <motion.div className="td2-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="td2-card-header">
            <div>
              <h1 className="td2-title">{ticket.title || `Ticket #${ticket.id}`}</h1>
              <p className="td2-meta">Ticket #{ticket.id} · Submitted on {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="td2-header-right">
              {user.role === 'ADMIN' && (
                <button className="td2-btn td2-btn-danger" onClick={handleDeleteTicket}>
                  🗑 Delete
                </button>
              )}
              <span className="td2-status"
                style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="td2-badges">
            <span className="td2-category">{ticket.category}</span>
            <span className="td2-priority" style={{ background: pc.bg, color: pc.color }}>
              <span className="td2-priority-dot" style={{ background: pc.dot }} />
              {ticket.priorityLevel} Priority
            </span>
          </div>

          {/* Info grid */}
          <div className="td2-info-grid">
            {[
              { label: '📍 Location', value: ticket.location },
              { label: '✉ Email',    value: ticket.email },
              { label: '📞 Contact', value: ticket.contactInfo },
              { label: '🕐 Created', value: new Date(ticket.createdAt).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="td2-info-item">
                <div className="td2-info-label">{label}</div>
                <div className="td2-info-value">{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="td2-section">
            <div className="td2-section-title">📝 Description</div>
            <p className="td2-description">{ticket.description}</p>
          </div>

          {/* Status note */}
          {ticket.statusNote && (
            <div className="td2-section">
              <div className="td2-section-title">💬 Status Note ({ticket.status.replace('_',' ')})</div>
              <div className="td2-status-note">"{ticket.statusNote}"</div>
            </div>
          )}

          {/* Evidence */}
          {ticket.attachedEvidences?.length > 0 && (
            <div className="td2-section">
              <div className="td2-section-title">📎 Attachments</div>
              <div className="td2-evidence-grid">
                {ticket.attachedEvidences.map((f, i) => (
                  <a key={i} href={`http://localhost:8080/api/files/${f}`} target="_blank" rel="noopener noreferrer">
                    <img src={`http://localhost:8080/api/files/${f}`} alt={`Evidence ${i+1}`} className="td2-evidence-img" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Admin controls ── */}
        {user.role === 'ADMIN' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

            {/* Assign technician */}
            <div className="td2-admin-card">
              <div className="td2-admin-title">👷 Assign Technician</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <select className="td2-select" value={selectedTechId}
                  onChange={e => setSelectedTechId(e.target.value)}>
                  <option value="">Select a technician…</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button className="td2-btn td2-btn-primary" onClick={handleAssignTech}>Assign</button>
              </div>
              {ticket.assignedTechnicianName && (
                <div className="td2-assigned">✓ Assigned to: {ticket.assignedTechnicianName}</div>
              )}
            </div>

            {/* Resolution notes */}
            <div className="td2-admin-card">
              <div className="td2-admin-title">📋 Resolution Notes</div>
              <textarea className="td2-input" rows={3}
                placeholder="Add internal resolution details…"
                value={resNotes} onChange={e => setResNotes(e.target.value)} />
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="td2-btn td2-btn-primary" onClick={handleAddResolution} disabled={isAddingRes}>
                  {isAddingRes ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Status management ── */}
        {canManage && (
          <motion.div className="td2-admin-card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="td2-admin-title">🔄 Update Status</div>
            <div className="td2-status-btns">
              {['OPEN','IN_PROGRESS','RESOLVED','REJECTED','CLOSED'].map(s => {
                if (user.role === 'TECHNICIAN' && s === 'REJECTED') return null;
                const cfg = STATUS_CFG[s];
                return (
                  <button key={s}
                    className={`td2-status-btn${ticket.status === s ? ' td2-status-btn-active' : ''}`}
                    style={ticket.status === s ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                    onClick={() => setShowStatusConfirm(s)}
                    disabled={isUpdating}>
                    {s.replace('_',' ')}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showStatusConfirm && (
                <motion.div className="td2-confirm-box"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div className="td2-confirm-label">
                    Reason for changing to {showStatusConfirm.replace('_',' ')}
                  </div>
                  <textarea className="td2-input" rows={3}
                    placeholder="Enter reason or note…"
                    value={statusNote} onChange={e => setStatusNote(e.target.value)} />
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button className="td2-btn td2-btn-primary" onClick={handleStatusChange} disabled={isUpdating}>
                      Confirm
                    </button>
                    <button className="td2-btn td2-btn-outline" onClick={() => setShowStatusConfirm(null)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Discussion ── */}
        <motion.div className="td2-discussion"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

          <div className="td2-discussion-header">
            💬 Discussion ({comments.length})
          </div>

          {/* Comment form */}
          <form onSubmit={handleAddComment} className="td2-comment-form">
            <textarea className="td2-input" rows={3}
              placeholder="Add a comment or update…"
              value={newComment} onChange={e => setNewComment(e.target.value)} required />
            <div className="td2-comment-actions">
              <button type="submit" className="td2-btn td2-btn-primary">Post Comment</button>
            </div>
          </form>

          {/* Comments */}
          <div className="td2-comments-list">
            {comments.length === 0 && (
              <div className="td2-empty-comments">No comments yet. Be the first to comment.</div>
            )}
            {comments.map(c => (
              <motion.div key={c.id} className="td2-comment"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="td2-comment-header">
                  <span className="td2-comment-author">{c.userName || 'User'}</span>
                  <span className="td2-comment-time">{new Date(c.createdAt).toLocaleString()}</span>
                </div>

                {editingId === c.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea className="td2-input" rows={2}
                      value={editingText} onChange={e => setEditingText(e.target.value)} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="td2-btn td2-btn-primary" style={{ padding: '5px 14px', fontSize: 12 }}
                        onClick={() => handleEditComment(c.id)}>Save</button>
                      <button className="td2-btn td2-btn-outline" style={{ padding: '5px 14px', fontSize: 12 }}
                        onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="td2-comment-text">{c.text}</p>
                    {(user.role === 'ADMIN' || (c.userId && String(c.userId) === String(user.id))) && (
                      <div className="td2-comment-btns">
                        <button className="td2-comment-btn td2-comment-btn-edit"
                          onClick={() => { setEditingId(c.id); setEditingText(c.text); }}>Edit</button>
                        <button className="td2-comment-btn td2-comment-btn-delete"
                          onClick={() => handleDeleteComment(c.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default TicketDetails;
