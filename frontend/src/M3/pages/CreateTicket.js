import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { ticketApi, categoryApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/module3.css';

const CreateTicket = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        priority: 'Medium',
        category: '',
        location: '',
        email: user?.email || '',
        contactInfo: '',
        description: ''
    });

    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAllCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length + files.length > 3) {
            alert('Maximum 3 images allowed');
            return;
        }

        const validFiles = selectedFiles.filter(file => {
            const isValidType = ['.jpg', '.jpeg', '.png'].includes(file.name.substring(file.name.lastIndexOf('.')).toLowerCase());
            const isValidSize = file.size <= 5 * 1024 * 1024;
            return isValidType && isValidSize;
        });

        const newFiles = [...files, ...validFiles];
        setFiles(newFiles);
        
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.description.length < 10) {
            setError('Description must be at least 10 characters.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('userId', user.id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('email', formData.email);
        data.append('contactInfo', formData.contactInfo);
        data.append('priorityLevel', formData.priority);
        
        files.forEach(file => {
            data.append('evidences', file);
        });

        try {
            await ticketApi.createTicket(data);
            navigate('/m3');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="m3-container">
            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="m3-title">Create New Ticket</h1>
                <p className="m3-subtitle">Fill out the form below to create a new support ticket</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Ticket Title <span>*</span></label>
                        <input 
                            name="title"
                            className="form-input"
                            placeholder="Enter a brief title for your ticket"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Priority <span>*</span></label>
                            <select 
                                name="priority"
                                className="form-select"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category <span>*</span></label>
                            <select 
                                name="category"
                                className="form-select"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Location/Resource <span>*</span></label>
                            <input 
                                name="location"
                                className="form-input"
                                placeholder="e.g., Room 101, Server Room"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email <span>*</span></label>
                            <input 
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="your.email@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Info <span>*</span></label>
                        <input 
                            name="contactInfo"
                            className="form-input"
                            placeholder="Phone number or alternative contact method"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description <span>*</span></label>
                        <textarea 
                            name="description"
                            className="form-textarea"
                            rows="5"
                            placeholder="Provide detailed information about your issue or request"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={1000}
                            required
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            {formData.description.length} / 1000
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Attachments</label>
                        <div className="file-upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Click to upload files</p>
                            <input 
                                id="fileInput"
                                type="file" 
                                multiple 
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <div className="evidence-preview">
                            <AnimatePresence>
                                {previews.map((src, i) => (
                                    <motion.div 
                                        key={src}
                                        className="preview-container"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <img src={src} alt="preview" className="preview-img" />
                                        <button type="button" className="remove-file" onClick={() => removeFile(i)}>×</button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontWeight: 600 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                        <button 
                            type="button" 
                            className="m3-button m3-button-secondary" 
                            onClick={() => navigate('/m3')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="m3-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTicket;
