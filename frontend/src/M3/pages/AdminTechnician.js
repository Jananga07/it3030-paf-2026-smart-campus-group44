import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/module3.css';

const AdminTechnician = () => {
    const navigate = useNavigate();
    const [technicians, setTechnicians] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'TechPassword123' // Default password for new techs
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const data = await ticketApi.getTechnicians();
            setTechnicians(data);
        } catch (err) {
            setError("Failed to fetch technicians");
        }
    };

    const handleAddTechnician = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await ticketApi.addTechnician(formData.name, formData.email, formData.password);
            setFormData({ ...formData, name: '', email: '' });
            setSuccess(`Technician "${formData.name}" added successfully!`);
            setTimeout(() => setSuccess(''), 3000);
            fetchTechnicians();
        } catch (err) {
            setError(err.message || 'Failed to add technician');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTechnician = async (id) => {
        if (!window.confirm("Are you sure you want to remove this technician? This will delete their user account.")) return;
        
        try {
            await ticketApi.deleteTechnician(id);
            fetchTechnicians();
        } catch (err) {
            setError("Failed to delete technician");
        }
    };

    return (
        <div className="m3-container">
            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h1 className="m3-title">Manage Technicians</h1>
                <p className="m3-subtitle">Register or remove staff members who handle tickets</p>

                <form onSubmit={handleAddTechnician} style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Name</label>
                            <input 
                                className="form-input"
                                placeholder="Technician Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email</label>
                            <input 
                                className="form-input"
                                type="email"
                                placeholder="tech@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="m3-button" 
                            style={{ width: 'auto', whiteSpace: 'nowrap', height: '3.5rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add Technician'}
                        </button>
                    </div>
                </form>

                {error && <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>{error}</p>}
                {success && <p style={{ color: '#34d399', marginBottom: '1.5rem', fontWeight: 600 }}>{success}</p>}

                <div className="category-list">
                    <h3 className="form-label">Existing Technicians</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <AnimatePresence>
                            {technicians.map((tech) => (
                                <motion.div 
                                    key={tech.id}
                                    className="comment-item"
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 600, display: 'block' }}>{tech.name}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tech.email}</span>
                                    </div>
                                    <button 
                                        className="remove-file" 
                                        style={{ position: 'static' }}
                                        onClick={() => handleDeleteTechnician(tech.id)}
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {technicians.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No technicians registered yet.</p>}
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <button 
                        className="m3-button m3-button-secondary" 
                        onClick={() => navigate('/tickets')}
                        style={{ width: 'auto' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminTechnician;
