import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RESOURCE_TYPES = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];

// Hourly slots 6:00 AM – 10:00 PM
const HOUR_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour  = i + 6;
  const label = hour < 12 ? `${hour}:00 AM` : hour === 12 ? `12:00 PM` : `${hour - 12}:00 PM`;
  const value = `${String(hour).padStart(2, '0')}:00`;
  return { label, value };
});

const EMPTY_FORM = {
  name: "",
  type: "LECTURE_HALL",
  capacity: "",
  location: "",
  availableFrom: "",
  availableTo: "",
  status: "ACTIVE",
  description: "",
};

export default function ResourceFormModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(resource);

  useEffect(() => {
    if (resource) {
      setForm({
        name: resource.name || "",
        type: resource.type || "LECTURE_HALL",
        capacity: resource.capacity || "",
        location: resource.location || "",
        availableFrom: resource.availableFrom || "",
        availableTo: resource.availableTo || "",
        status: resource.status || "ACTIVE",
        description: resource.description || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [resource]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.capacity || form.capacity < 1) e.capacity = "Capacity must be ≥ 1";
    if (form.availableFrom && form.availableTo && form.availableFrom >= form.availableTo)
      e.availableTo = "Available To must be after Available From";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSave(
        {
          ...form,
          capacity: parseInt(form.capacity, 10),
        },
        resource?.id
      );
      onClose();
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{isEdit ? "Edit Resource" : "Add New Resource"}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {errors.api && <div className="form-error-banner">{errors.api}</div>}

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label>Resource Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Lab A-201" className={errors.name ? "input-error" : ""} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Block A, Floor 2" className={errors.location ? "input-error" : ""} />
                {errors.location && <span className="field-error">{errors.location}</span>}
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange}
                  placeholder="e.g. 40" min="1"
                  className={errors.capacity ? "input-error" : ""} />
                {errors.capacity && <span className="field-error">{errors.capacity}</span>}
              </div>
            </div>

            {/* Row 3 - Availability */}
            <div className="form-row">
              <div className="form-group">
                <label>Available From</label>
                <select name="availableFrom" value={form.availableFrom} onChange={handleChange}>
                  <option value="">Select start time</option>
                  {HOUR_SLOTS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Available To</label>
                <select name="availableTo" value={form.availableTo} onChange={handleChange}
                  className={errors.availableTo ? "input-error" : ""}>
                  <option value="">Select end time</option>
                  {HOUR_SLOTS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.availableTo && <span className="field-error">{errors.availableTo}</span>}
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>
              <div className="status-toggle">
                {["ACTIVE", "OUT_OF_SERVICE"].map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`toggle-btn ${form.status === s ? "toggle-active" : ""}`}
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                  >
                    {s === "ACTIVE" ? "✔ Active" : "✖ Out of Service"}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Optional description..." rows={3} />
            </div>

            {/* Submit */}
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Resource" : "Add Resource"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
