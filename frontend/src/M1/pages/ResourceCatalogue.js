import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResourceCard from "../components/ResourceCard";
import ResourceFilter from "../components/ResourceFilter";
import ResourceFormModal from "../components/ResourceFormModal";
import { getAllResources, searchResources, updateResource, deleteResource } from "../api/resourceApi";
import "../styles/Module1.css";

export default function ResourceCatalogue() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
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
    try {
      await updateResource(id, formData);
      showToast("Resource updated successfully");
      await loadAll();
    } catch (e) {
      showToast(e.message, "error");
    }
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

  return (
    <div className="m1-page">
      <ResourceFilter onFilter={handleFilter} onReset={loadAll} />

      <div className="m1-controls">
        <span className="result-count">
          {loading ? "Loading…" : `${resources.length} resource${resources.length !== 1 ? "s" : ""} found`}
        </span>
        <div className="view-toggle">
          <button className={`view-btn ${viewMode === "grid" ? "view-active" : ""}`}
            onClick={() => setViewMode("grid")} title="Grid view">⊞</button>
          <button className={`view-btn ${viewMode === "list" ? "view-active" : ""}`}
            onClick={() => setViewMode("list")} title="List view">☰</button>
        </div>
      </div>

      {error && (
        <div className="m1-error">
          <span>⚠ {error}</span>
          <button onClick={loadAll}>Retry</button>
        </div>
      )}

      {loading && (
        <div className={`resource-${viewMode}`}>
          {[1,2,3,4,5,6].map((n) => <div key={n} className="skeleton-card" />)}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🏫</span>
          <h3>No resources found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <div className={`resource-${viewMode}`}>
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              isAdmin={true}
              onEdit={openEdit}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" style={{ maxWidth: 400 }}
              initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
              <h2>Delete Resource?</h2>
              <p style={{ color: "#6b7280", marginBottom: 24 }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="rc-btn rc-btn-view" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="rc-btn rc-btn-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <ResourceFormModal
            resource={editTarget}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
