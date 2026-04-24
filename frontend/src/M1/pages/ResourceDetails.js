import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getResourceById, updateResourceStatus, updateResource } from "../api/resourceApi";
import ResourceFormModal from "../components/ResourceFormModal";
import "../styles/Module1.css";

const TYPE_ICONS = {
  LECTURE_HALL: "🏛️",
  LAB: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

const STATUS_COLORS = {
  ACTIVE: { bg: "#d1fae5", text: "#065f46" },
  INACTIVE: { bg: "#fee2e2", text: "#991b1b" },
  UNDER_MAINTENANCE: { bg: "#fef3c7", text: "#92400e" },
};

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

  useEffect(() => { load(); }, [id]); // eslint-disable-line

  const handleStatusToggle = async () => {
    const next = resource.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const updated = await updateResourceStatus(id, next);
      setResource(updated);
      showToast(`Status changed to ${next}`);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleSave = async (formData) => {
    try {
      const updated = await updateResource(id, formData);
      setResource(updated);
      setShowEdit(false);
      showToast("Resource updated");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  if (loading) return (
    <div className="m1-page">
      <div className="m1-topbar"><button className="back-btn" onClick={() => navigate("/resources")}>← Back</button></div>
      <div className="detail-skeleton" />
    </div>
  );

  if (error) return (
    <div className="m1-page">
      <div className="m1-topbar"><button className="back-btn" onClick={() => navigate("/resources")}>← Back</button></div>
      <div className="m1-error"><span>⚠ {error}</span><button onClick={load}>Retry</button></div>
    </div>
  );

  if (!resource) return null;
  const statusStyle = STATUS_COLORS[resource.status] || { bg: "#f3f4f6", text: "#374151" };

  return (
    <div className="m1-page">
      <div className="m1-topbar">
        <button className="back-btn" onClick={() => navigate("/resources")}>← All Resources</button>
      </div>

      <motion.div className="detail-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="detail-header">
          <span className="detail-icon">{TYPE_ICONS[resource.type] || "🏢"}</span>
          <div className="detail-title-block">
            <h1 className="detail-name">{resource.name}</h1>
            <span className="detail-type">{resource.type?.replace("_", " ")}</span>
          </div>
          <span className="detail-status-badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>
            {resource.status}
          </span>
        </div>

        <div className="detail-meta">
          <div className="detail-meta-item">
            <span className="detail-meta-label">📍 Location</span>
            <span className="detail-meta-value">{resource.location}</span>
          </div>
          <div className="detail-meta-item">
            <span className="detail-meta-label">👥 Capacity</span>
            <span className="detail-meta-value">{resource.capacity} people</span>
          </div>
          {resource.availableFrom && resource.availableTo && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">⏰ Available</span>
              <span className="detail-meta-value">{resource.availableFrom} – {resource.availableTo}</span>
            </div>
          )}
        </div>

        {resource.description && (
          <div className="detail-description">
            <h3>Description</h3>
            <p>{resource.description}</p>
          </div>
        )}

        <div className="detail-actions">
          <button className="btn-primary" onClick={() => setShowEdit(true)}>✏️ Edit Resource</button>
          <button
            className={resource.status === "ACTIVE" ? "btn-warning" : "btn-success"}
            onClick={handleStatusToggle}
          >
            {resource.status === "ACTIVE" ? "Set Out of Service" : "Set Active"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <ResourceFormModal resource={resource} onClose={() => setShowEdit(false)} onSave={handleSave} />
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
