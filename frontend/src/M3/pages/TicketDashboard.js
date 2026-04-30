import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../M5/useAuth';
import { ticketApi } from '../api/client';
import { motion } from 'framer-motion';
import '../styles/module3.css';

const getStatusColor = (status) => {
    switch (status) {
        case 'OPEN':        return '#818cf8';
        case 'IN_PROGRESS': return '#fbbf24';
        case 'RESOLVED':    return '#34d399';
        case 'REJECTED':    return '#f472b6';
        case 'CLOSED':      return '#94a3b8';
        default:            return '#ccc';
    }
};

const TicketDashboard = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const navigate = useNavigate();

    const fetchTickets = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await ticketApi.getAllTickets(user.id);
            setTickets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to load tickets.');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) fetchTickets();
        else setLoading(false);
    }, [user, fetchTickets]);

    if (!user) return (
        <div className="m3-container">
            <div className="glass-card" style={{ textAlign: 'center' }}>
                <p>Please log in to view tickets.</p>
                <button className="m3-button" style={{ width: 'auto', marginTop: '1rem' }}
                    onClick={() => navigate('/login')}>
                    Sign In
                </button>
            </div>
        </div>
    );

    return (
        <div className="m3-container">
            <header className="m3-header">
                <div>
                    <h1 className="m3-title">Support Desk</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Welcome back, {user.name} ({user.role})
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user.role === 'ADMIN' && (
                        <>
                            <button className="m3-button m3-button-secondary"
                                onClick={() => navigate('/admin/ticket-categories')}
                                style={{ width: 'auto' }}>
                                Manage Categories
                            </button>
                            <button className="m3-button m3-button-secondary"
                                onClick={() => navigate('/admin/technicians')}
                                style={{ width: 'auto' }}>
                                Manage Technicians
                            </button>
                        </>
                    )}
                    <button className="m3-button" onClick={() => navigate('/tickets/create')} style={{ width: 'auto' }}>
                        + New Ticket
                    </button>
                </div>
            </header>

            {error && (
                <div className="glass-card" style={{ color: '#f472b6', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <div className="m3-grid">
                    {tickets.map((ticket, index) => (
                        <motion.div
                            key={ticket.id}
                            className="glass-card ticket-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.07 }}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className="status-badge"
                                    style={{ background: getStatusColor(ticket.status) }}>
                                    {ticket.status}
                                </span>
                                <span className={`priority-badge priority-${ticket.priorityLevel}`}>
                                    {ticket.priorityLevel} Priority
                                </span>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>
                                {ticket.title || `Ticket #${ticket.id}`}
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                                {ticket.category}
                            </div>
                            <p style={{
                                color: 'var(--text-muted)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.95rem',
                            }}>
                                {ticket.description}
                            </p>
                            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{ticket.location}</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}

                    {tickets.length === 0 && (
                        <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                            <p>No tickets found. Create your first ticket!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketDashboard;
