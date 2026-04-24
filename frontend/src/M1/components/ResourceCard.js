import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TYPE_ICONS = {
  LECTURE_HALL: "🏛️",
  LAB: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

export default function ResourceCard({ resource, onEdit, onDelete, isAdmin }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="resource-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.25 }}
    >
      {/* Status badge */}
      <span className={`status-badge ${resource.status === "ACTIVE" ? "badge-active" : "badge-oos"}`}>
        {resource.status === "ACTIVE" ? "✔ Active" : "✖ Out of Service"}
      </span>

      {/* Type icon + name */}
      <div className="rc-header">
        <span className="rc-icon">{TYPE_ICONS[resource.type] || "📦"}</span>
        <div>
          <h3 className="rc-name">{resource.name}</h3>
          <span className="rc-type">{resource.type?.replace("_", " ")}</span>
        </div>
      </div>

      {/* Meta info */}
      <div className="rc-meta">
        <div className="rc-meta-item">
          <span className="rc-meta-label">📍 Location</span>
          <span>{resource.location}</span>
        </div>
        <div className="rc-meta-item">
          <span className="rc-meta-label">👥 Capacity</span>
          <span>{resource.capacity}</span>
        </div>
        {resource.availableFrom && resource.availableTo && (
          <div className="rc-meta-item">
            <span className="rc-meta-label">⏰ Available</span>
            <span>{resource.availableFrom} – {resource.availableTo}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="rc-actions">
        <button
          className="rc-btn rc-btn-view"
          onClick={() => navigate(`/resources/${resource.id}`)}
        >
          View Details
        </button>
        {isAdmin && (
          <>
            <button className="rc-btn rc-btn-edit" onClick={() => onEdit(resource)}>
              Edit
            </button>
            <button className="rc-btn rc-btn-delete" onClick={() => onDelete(resource.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
