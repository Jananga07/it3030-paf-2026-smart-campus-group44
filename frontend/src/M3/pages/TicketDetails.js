import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../M5/useAuth';
import { ticketApi, commentApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/module3.css';

const TicketDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusNote, setStatusNote] = useState('');
    const [showStatusConfirm, setShowStatusConfirm] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechId, setSelectedTechId] = useState('');
    const [resNotes, setResNotes] = useState('');
    const [isAddingRes, setIsAddingRes] = useState(false);

    const fetchData = React.useCallback(async () => {
        try {
            const [ticketData, commentsData] = await Promise.all([
                ticketApi.getTicketById(id),
                commentApi.getComments(id)
            ]);
            setTicket(ticketData);
            setComments(commentsData);
            setResNotes(ticketData.resolutionNotes || '');
            
            if (user.role === 'ADMIN') {
                const techData = await ticketApi.getTechnicians();
                setTechnicians(techData);
            }
        } catch (error) {
            console.error(error);
            navigate('/tickets');
        }
    }, [id, user.role, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = async () => {
        if (!statusNote.trim()) {
            alert("Please provide a reason/note for this status change.");
            return;
        }
        setIsUpdating(true);
        try {
            await ticketApi.updateStatus(id, showStatusConfirm, statusNote, user.id);
            setShowStatusConfirm(null);
            setStatusNote('');
            await fetchData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await commentApi.addComment(id, user.id, newComment);
            setNewComment('');
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editingCommentText.trim()) return;
        console.log(`Attempting to edit comment ${commentId} as user ${user.id}`);
        try {
            await commentApi.updateComment(commentId, user.id, editingCommentText);
            setEditingCommentId(null);
            setEditingCommentText('');
            await fetchData();
        } catch (error) {
            console.error("Edit failed:", error);
            alert("Could not edit comment: " + error.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await commentApi.deleteComment(commentId, user.id);
            await fetchData();
        } catch (error) {
            alert("Could not delete comment: " + error.message);
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this ticket and all its comments?')) return;
        try {
            await ticketApi.deleteTicket(id, user.id);
            navigate('/tickets');
        } catch (error) {
            alert("Could not delete ticket: " + error.message);
        }
    };

    const handleAssignTech = async () => {
        if (!selectedTechId) return;
        try {
            await ticketApi.assignTechnician(id, selectedTechId, user.id);
            alert("Technician assigned successfully!");
            await fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAddResolution = async () => {
        if (!resNotes.trim()) return;
        setIsAddingRes(true);
        try {
            await ticketApi.addResolutionNotes(id, resNotes, user.id);
            alert("Resolution notes saved!");
            await fetchData();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsAddingRes(false);
        }
    };

    if (!ticket) return <div className="m3-container">Loading...</div>;

    const canManageStatus = user.role === 'ADMIN' || (user.role === 'TECHNICIAN' && ticket.assignedTechnicianId && String(ticket.assignedTechnicianId) === String(user.id));

    return (
        <div className="m3-container">
            <button className="m3-button m3-button-secondary" onClick={() => navigate('/tickets')} style={{ marginBottom: '1.5rem', width: 'auto' }}>
                &larr; Back to Dashboard
            </button>

            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="m3-header" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 className="m3-title">{ticket.title}</h1>
                        <p className="m3-subtitle">Ticket #{ticket.id} • Submitted on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {user.role === 'ADMIN' && (
                            <button 
                                className="m3-button" 
                                style={{ background: '#ef4444', width: 'auto' }}
                                onClick={handleDeleteTicket}
                            >
                                Delete Ticket
                            </button>
                        )}
                        <span className="status-badge" style={{ background: getStatusColor(ticket.status) }}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{ticket.category}</span>
                    <span className={`priority-badge priority-${ticket.priorityLevel}`}>
                        {ticket.priorityLevel} Priority
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
                    <div>
                        <h4 className="form-label">Location / Resource</h4>
                        <p>{ticket.location}</p>
                    </div>
                    <div>
                        <h4 className="form-label">Contact Email</h4>
                        <p>{ticket.email}</p>
                    </div>
                    <div>
                        <h4 className="form-label">Contact Info</h4>
                        <p>{ticket.contactInfo}</p>
                    </div>
                    <div>
                        <h4 className="form-label">Created At</h4>
                        <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                {ticket.attachedEvidences && ticket.attachedEvidences.length > 0 && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 className="form-label">Attached Evidence</h4>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {ticket.attachedEvidences.map((fileName, idx) => (
                                <a key={idx} href={`http://localhost:8080/api/files/${fileName}`} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src={`http://localhost:8080/api/files/${fileName}`} 
                                        alt={`Evidence ${idx + 1}`} 
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <h4 className="form-label">Description</h4>
                    <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                </div>

                {ticket.statusNote && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--glass)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h4 className="form-label" style={{ color: ticket.status === 'REJECTED' ? 'var(--secondary)' : 'var(--primary)' }}>
                            Latest Status Note ({ticket.status})
                        </h4>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>"{ticket.statusNote}"</p>
                    </div>
                )}

                {user.role === 'ADMIN' && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 className="form-label">Assign Technician</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <select 
                                className="form-select" 
                                value={selectedTechId} 
                                onChange={(e) => setSelectedTechId(e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="">Select a technician...</option>
                                {technicians.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                            <button className="m3-button" onClick={handleAssignTech} style={{ width: 'auto' }}>Assign</button>
                        </div>
                        {ticket.assignedTechnicianName && (
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                Currently assigned to: <strong>{ticket.assignedTechnicianName}</strong>
                            </p>
                        )}
                    </div>
                )}

                {(user.role === 'ADMIN' || (user.role === 'TECHNICIAN' && ticket.assignedTechnicianId && String(ticket.assignedTechnicianId) === String(user.id))) && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 className="form-label">Resolution Notes</h4>
                        <textarea 
                            className="form-textarea"
                            value={resNotes}
                            onChange={(e) => setResNotes(e.target.value)}
                            placeholder="Add internal resolution details here..."
                            rows="3"
                        />
                        <button className="m3-button" onClick={handleAddResolution} disabled={isAddingRes} style={{ marginTop: '1rem', width: 'auto' }}>
                            Update Resolution Notes
                        </button>
                    </div>
                )}

                {canManageStatus && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 className="form-label">Manage Ticket Status</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'].map(status => {
                                if (user.role === 'TECHNICIAN' && status === 'REJECTED') return null;
                                return (
                                    <button 
                                        key={status}
                                        className={`m3-button ${ticket.status === status ? '' : 'm3-button-secondary'}`}
                                        style={{ width: 'auto', fontSize: '0.9rem' }}
                                        onClick={() => setShowStatusConfirm(status)}
                                        disabled={isUpdating}
                                    >
                                        {status}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {showStatusConfirm && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginTop: '1.5rem' }}
                        >
                            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem' }}>
                                <h4 className="form-label">Reason for changing status to {showStatusConfirm}</h4>
                                <textarea 
                                    className="form-textarea"
                                    placeholder="Enter reason or note for this status change..."
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    rows="3"
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button className="m3-button" onClick={handleStatusChange} disabled={isUpdating}>
                                        Confirm Status Change
                                    </button>
                                    <button className="m3-button m3-button-secondary" onClick={() => setShowStatusConfirm(null)} style={{ width: 'auto' }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div style={{ marginTop: '4rem' }}>
                <h3 className="m3-title" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Discussion</h3>
                
                <form onSubmit={handleAddComment} style={{ marginBottom: '3rem' }}>
                    <div className="form-group">
                        <textarea 
                            className="form-textarea"
                            placeholder="Add a comment or update..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            rows="3"
                        />
                        <button type="submit" className="m3-button" style={{ marginTop: '1rem', width: 'auto' }}>
                            Post Comment
                        </button>
                    </div>
                </form>

                <div className="comments-list">
                    {comments.map((comment) => (
                        <motion.div 
                            key={comment.id} 
                            className="comment-item"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{comment.userName} ({comment.userRole})</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </div>
                            
                            {editingCommentId === comment.id ? (
                                <div style={{ marginTop: '1rem' }}>
                                    <textarea 
                                        className="form-textarea"
                                        value={editingCommentText}
                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                        rows="2"
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button className="m3-button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => handleEditComment(comment.id)}>Save</button>
                                        <button className="m3-button m3-button-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', width: 'auto' }} onClick={() => setEditingCommentId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p style={{ margin: '0.5rem 0', lineHeight: '1.5' }}>{comment.text}</p>
                                    {(user.role === 'ADMIN' || (comment.userId && user.id && String(comment.userId) === String(user.id))) && (
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                                            <button 
                                                onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.text); }}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteComment(comment.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'OPEN': return '#818cf8'; // Indigo
        case 'IN_PROGRESS': return '#fbbf24'; // Warning
        case 'RESOLVED': return '#34d399'; // Success
        case 'REJECTED': return '#f472b6'; // Pink/Accent
        case 'CLOSED': return '#94a3b8'; // Muted
        default: return '#ccc';
    }
};

export default TicketDetails;
