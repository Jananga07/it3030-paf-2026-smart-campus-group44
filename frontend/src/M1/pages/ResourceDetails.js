import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getResourceById, updateResourceStatus } from "../api/resourceApi";
import ResourceFormModal from "../components/ResourceFormModal";
import { updateResource } from "../api/resourceApi";
import "../styles/Module1.css";

const TYPE_ICONS = {
  LECTURE_HALL: "🏛️",
  LAB: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

const IS_ADMIN = true;

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResourceById(id);
      setResource(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusToggle = async () => {
    const newStatus = resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    try {
      await updateResourceStatus(id, newStatus);
      setResource((prev) => ({ ...prev, status: newStatus }));
      showToast(`Status changed to ${newStatus.replace("_", " ")}`);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleSave = async (formData) => {
    await updateResource(id, formData);
    await load();
    showToast("Resource updated successfully");
  };

  if (loading) return (
    <div className="m1-page">
      <div className="detail-skeleton" />
    </div>
  );

  if (error) return (
    <div className="m1-page">
      <div className="m1-error">
        <span>⚠ {error}</span>
        <button onClick={load}>Retry</button>
      </div>
    </div>
  );

  if (!resource) return null;

  return (
    <div className="m1-page">
      {/* ── Breadcrumb ──────────────────────────────────── */}
      <div className="breadcrumb">
        <button onClick={() => navigate("/")} className="bc-link">Home</button>
        <span className="bc-sep">›</span>
        <button onClick={() => navigate("/resources")} className="bc-link">Catalogue</button>
        <span className="bc-sep">›</span>
        <span className="bc-current">{resource.name}</span>
      </div>

      {/* ── Detail Card ─────────────────────────────────── */}
      <motion.div
        className="detail-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon-wrap">
            <span className="detail-icon">{TYPE_ICONS[resource.type] || "📦"}</span>
          </div>
          <div className="detail-title-block">
            <h1 className="detail-name">{resource.name}</h1>
            <span className="detail-type-tag">{resource.type?.replace("_", " ")}</span>
          </div>
          <span className={`status-badge ${resource.status === "ACTIVE" ? "badge-active" : "badge-oos"}`}>
            {resource.status === "ACTIVE" ? "✔ Active" : "✖ Out of Service"}
          </span>
        </div>

        {/* Info Grid */}
        <div className="detail-grid">
          <div className="detail-info-card">
            <span className="di-icon">📍</span>
            <div>
              <span className="di-label">Location</span>
              <span className="di-value">{resource.location}</span>
            </div>
          </div>
          <div className="detail-info-card">
            <span className="di-icon">👥</span>
            <div>
              <span className="di-label">Capacity</span>
              <span className="di-value">{resource.capacity} people</span>
            </div>
          </div>
          {resource.availableFrom && (
            <div className="detail-info-card">
              <span className="di-icon">⏰</span>
              <div>
                <span className="di-label">Available From</span>
                <span className="di-value">{resource.availableFrom}</span>
              </div>
            </div>
          )}
          {resource.availableTo && (
            <div className="detail-info-card">
              <span className="di-icon">⏱️</span>
              <div>
                <span className="di-label">Available To</span>
                <span className="di-value">{resource.availableTo}</span>
              </div>
            </div>
          )}
          {resource.description && (
            <div className="detail-info-card detail-info-full">
              <span className="di-icon">📝</span>
              <div>
                <span className="di-label">Description</span>
                <span className="di-value">{resource.description}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {IS_ADMIN && (
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => setShowEdit(true)}>✏️ Edit Resource</button>
            <button
              className={resource.status === "ACTIVE" ? "btn-warning" : "btn-success"}
              onClick={handleStatusToggle}
            >
              {resource.status === "ACTIVE" ? "Set Out of Service" : "Set Active"}
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Edit Modal ──────────────────────────────────── */}
      {showEdit && (
        <ResourceFormModal
          resource={resource}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

      {/* ── Toast ───────────────────────────────────────── */}
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
    </div>
  );
}
