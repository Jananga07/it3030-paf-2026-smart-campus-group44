import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResourceFormModal from "../M1/components/ResourceFormModal";
import { getAllResources, updateResource, deleteResource } from "../M1/api/resourceApi";
import AdminSidebar from "./AdminSidebar";

export default function AdminResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const handleSave = async (formData, id) => {
    try {
      await updateResource(id, formData);
      showToast("Resource updated successfully");
      setShowModal(false);
      setEditTarget(null);
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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minHeight: "100vh", background: "linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e7ff", padding: "18px 36px", display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>All Resources</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Manage campus facilities and assets</p>
        </div>
        <span style={{ marginLeft: "auto", background: "#eef2ff", color: "#4f46e5", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
          {resources.length} total
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 24px" }}>
        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 20px", color: "#dc2626", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠ {error}</span>
            <button onClick={loadAll} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280", fontSize: 16 }}>Loading resources…</div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: "#9ca3af" }}>
            <div style={{ fontSize: 48 }}>🏫</div>
            <p style={{ fontSize: 16 }}>No resources found</p>
          </div>
        )}

        {!loading && resources.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {resources.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(79,70,229,0.07)", border: "1px solid #e0e7ff", padding: 22 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e1b4b" }}>{r.name}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6366f1" }}>{r.type}</p>
                  </div>
                  <span style={{
                    background: r.status === "ACTIVE" ? "#d1fae5" : "#fee2e2",
                    color: r.status === "ACTIVE" ? "#065f46" : "#dc2626",
                    borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
                  }}>
                    {r.status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14, display: "flex", flexDirection: "column", gap: 4 }}>
                  {r.location && <span>📍 {r.location}</span>}
                  {r.capacity && <span>👥 Capacity: {r.capacity}</span>}
                  {r.description && <span style={{ color: "#9ca3af", fontStyle: "italic" }}>{r.description}</span>}
                </div>

                <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
                  <button
                    onClick={() => { setEditTarget(r); setShowModal(true); }}
                    style={{ flex: 1, background: "#eef2ff", color: "#4f46e5", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(r.id)}
                    style={{ flex: 1, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: "#fff", borderRadius: 16, padding: 32, width: 340, textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗑</div>
              <h3 style={{ margin: "0 0 8px", color: "#1e1b4b" }}>Delete Resource?</h3>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 600, cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editTarget && (
          <ResourceFormModal
            resource={editTarget}
            onClose={() => { setShowModal(false); setEditTarget(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
              background: toast.type === "error" ? "#ef4444" : "#10b981",
              color: "#fff", padding: "12px 28px", borderRadius: 12,
              fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
