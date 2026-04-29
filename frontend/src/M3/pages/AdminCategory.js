import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/module3.css';

const AdminCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError("Failed to fetch categories");
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsLoading(true);
        setError('');
        try {
            await categoryApi.addCategory(newCategory);
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        
        try {
            await categoryApi.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            setError("Failed to delete category");
        }
    };

    return (
        <div className="m3-container">
            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h1 className="m3-title">Manage Categories</h1>
                <p className="m3-subtitle">Add or remove ticket categories for the user side</p>

                <form onSubmit={handleAddCategory} style={{ marginBottom: '3rem' }}>
                    <div className="form-group">
                        <label className="form-label">New Category Name</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input 
                                className="form-input"
                                placeholder="e.g., Software Bugs, Hardware Issue"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                className="m3-button" 
                                style={{ width: 'auto', whiteSpace: 'nowrap' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Adding...' : 'Add Category'}
                            </button>
                        </div>
                    </div>
                </form>

                {error && <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>{error}</p>}

                <div className="category-list">
                    <h3 className="form-label">Existing Categories</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <AnimatePresence>
                            {categories.map((cat) => (
                                <motion.div 
                                    key={cat.id}
                                    className="comment-item"
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</span>
                                    <button 
                                        className="remove-file" 
                                        style={{ position: 'static' }}
                                        onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {categories.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No categories added yet.</p>}
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <button 
                        className="m3-button m3-button-secondary" 
                        onClick={() => navigate('/m3')}
                        style={{ width: 'auto' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminCategory;
