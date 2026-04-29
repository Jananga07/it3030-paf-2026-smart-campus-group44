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

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [ticketData, commentsData] = await Promise.all([
                ticketApi.getTicketById(id),
                commentApi.getComments(id)
            ]);
            setTicket(ticketData);
            setComments(commentsData);
        } catch (error) {
            console.error(error);
            navigate('/tickets');
        }
    };

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
        console.log(`Attempting to delete comment ${commentId} as user ${user.id}`);
        try {
            await commentApi.deleteComment(commentId, user.id);
            console.log("Delete successful");
            await fetchData();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Could not delete comment: " + error.message);
        }
    };

    if (!ticket) return <div className="m3-container">Loading...</div>;

    const canManage = user.role === 'ADMIN' || user.role === 'TECHNICIAN';

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="m3-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ticket.title || `Ticket #${ticket.id}`}</h1>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span className={`status-badge`} style={{ background: getStatusColor(ticket.status) }}>
                                {ticket.status}
                            </span>
                            <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{ticket.category}</span>
                            <span className={`priority-badge priority-${ticket.priorityLevel}`}>
                                {ticket.priorityLevel} Priority
                            </span>
                        </div>
                    </div>
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

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                    <h4 className="form-label">Description</h4>
                    <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                </div>

                {ticket.statusNote && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--glass)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h4 className="form-label" style={{ color: ticket.status === 'REJECTED' ? 'var(--secondary)' : 'var(--primary)' }}>
                            Status Change Reason ({ticket.status})
                        </h4>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>"{ticket.statusNote}"</p>
                    </div>
                )}

                {canManage && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <h4 className="form-label">Manage Ticket Status</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'].map(status => {
                                // Admin can set any status, Technician can set workflow status
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
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{comment.user.name} ({comment.user.role})</span>
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
                                    {(Number(comment.user.id) === Number(user.id) || user.role === 'ADMIN' || user.role === 'TECHNICIAN') && (
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
