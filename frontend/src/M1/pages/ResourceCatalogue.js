import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ResourceCard from "../components/ResourceCard";
import ResourceFilter from "../components/ResourceFilter";
import ResourceFormModal from "../components/ResourceFormModal";
import {
  getAllResources,
  searchResources,
  createResource,
  updateResource,
  deleteResource,
} from "../api/resourceApi";
import "../styles/Module1.css";

// ── demo admin flag (replace with auth context later) ──────────────────────
const IS_ADMIN = true;

export default function ResourceCatalogue() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleFilter = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchResources(filters);
      setResources(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, id) => {
    if (id) {
      await updateResource(id, formData);
      showToast("Resource updated successfully");
    } else {
      await createResource(formData);
      showToast("Resource created successfully");
    }
    await loadAll();
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      setDeleteConfirm(null);
      showToast("Resource deleted", "error");
      await loadAll();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const openEdit = (resource) => { setEditTarget(resource); setShowModal(true); };
  const openAdd  = () => { setEditTarget(null); setShowModal(true); };

  return (
    <div className="m1-page">
      {/* ── Topbar ──────────────────────────────────────── */}
      <div className="m1-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>← Home</button>
        <div className="m1-topbar-title">
          <h1>Facilities &amp; Assets Catalogue</h1>
          <p>Browse, search, and manage all campus resources</p>
        </div>
        {IS_ADMIN && (
          <button className="btn-primary" onClick={openAdd}>+ Add Resource</button>
        )}
      </div>

      {/* ── Filter Bar ──────────────────────────────────── */}
      <ResourceFilter onFilter={handleFilter} onReset={loadAll} />

      {/* ── Controls ────────────────────────────────────── */}
      <div className="m1-controls">
        <span className="result-count">
          {loading ? "Loading…" : `${resources.length} resource${resources.length !== 1 ? "s" : ""} found`}
        </span>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "view-active" : ""}`}
            onClick={() => setViewMode("grid")} title="Grid view"
          >⊞</button>
          <button
            className={`view-btn ${viewMode === "list" ? "view-active" : ""}`}
            onClick={() => setViewMode("list")} title="List view"
          >☰</button>
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {error && (
        <div className="m1-error">
          <span>⚠ {error}</span>
          <button onClick={loadAll}>Retry</button>
        </div>
      )}

      {/* ── Loading skeleton ────────────────────────────── */}
      {loading && (
        <div className={`resource-${viewMode}`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────── */}
      {!loading && !error && resources.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🏫</span>
          <h3>No resources found</h3>
          <p>Try adjusting your filters or add a new resource.</p>
          {IS_ADMIN && (
            <button className="btn-primary" onClick={openAdd}>+ Add First Resource</button>
          )}
        </div>
      )}

      {/* ── Cards ───────────────────────────────────────── */}
      {!loading && resources.length > 0 && (
        <div className={`resource-${viewMode}`}>
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              isAdmin={IS_ADMIN}
              onEdit={openEdit}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      )}

      {/* ── Form Modal ──────────────────────────────────── */}
      {showModal && (
        <ResourceFormModal
          resource={editTarget}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* ── Delete Confirm Dialog ───────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-box"
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
            >
              <h3>Delete Resource?</h3>
              <p>This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
