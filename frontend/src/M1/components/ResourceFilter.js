import React, { useState } from "react";

const RESOURCE_TYPES = ["ALL", "LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];
const STATUS_OPTIONS = ["ALL", "ACTIVE", "OUT_OF_SERVICE"];

export default function ResourceFilter({ onFilter, onReset }) {
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    capacity: "",
    status: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = {};
    if (filters.type && filters.type !== "ALL") clean.type = filters.type;
    if (filters.location.trim()) clean.location = filters.location.trim();
    if (filters.capacity) clean.capacity = filters.capacity;
    if (filters.status && filters.status !== "ALL") clean.status = filters.status;
    onFilter(clean);
  };

  const handleReset = () => {
    setFilters({ type: "", location: "", capacity: "", status: "" });
    onReset();
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      {/* Type */}
      <div className="filter-group">
        <label className="filter-label">Type</label>
        <select name="type" value={filters.type} onChange={handleChange} className="filter-select">
          <option value="">All Types</option>
          {RESOURCE_TYPES.filter((t) => t !== "ALL").map((t) => (
            <option key={t} value={t}>{t.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="e.g. Block A"
          className="filter-input"
        />
      </div>

      {/* Min Capacity */}
      <div className="filter-group">
        <label className="filter-label">Min Capacity</label>
        <input
          type="number"
          name="capacity"
          value={filters.capacity}
          onChange={handleChange}
          placeholder="e.g. 30"
          min="1"
          className="filter-input"
        />
      </div>

      {/* Status */}
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select name="status" value={filters.status} onChange={handleChange} className="filter-select">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-primary filter-btn">Search</button>
        <button type="button" onClick={handleReset} className="btn-outline filter-btn">Reset</button>
      </div>
    </form>
  );
}
