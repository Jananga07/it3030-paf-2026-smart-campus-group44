import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "./authService";
import "./AdminPage.css";
// Module 4 – Notifications admin panel
import AdminNotificationsPanel from "../M4/AdminNotificationsPanel";
// Shared admin sidebar
import AdminSidebar from "../AdminDashboard/AdminSidebar";

/**
 * AdminPage – Module 5 (Member 5)
 *
 * Full-page admin dashboard for user management.
 * Route: /admin  (ADMIN role only – protected by ProtectedRoute)
 *
 * Mirrors the structure of NotificationsPage (Module 4):
 *  - page header with back button
 *  - controls bar (filter / actions)
 *  - card list
 *  - loading / error / empty states
 *
 * Endpoints used:
 *   GET   /api/admin/users
 *   PATCH /api/admin/users/{id}/role
 */

const BASE_URL = "http://localhost:8080/api/admin";

export default function AdminPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate              = useNavigate();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/users`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
    } catch {
      alert("Could not update role. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div className="admin-page" style={{ flex: 1 }}>
      {/* Page header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          👥 User Management
        </h1>
      </div>

      <div className="admin-page-content">
        {/* Controls bar – mirrors notif-page-controls */}
        <div className="admin-page-controls">
          <span className="admin-page-count">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </span>
          <button className="admin-page-action-btn" onClick={loadUsers}>
            ↺ Refresh
          </button>
        </div>

        {/* States */}
        {loading && <div className="admin-page-loading">Loading users…</div>}
        {error   && <div className="admin-page-error">{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className="admin-page-empty">
            <span className="admin-page-empty-icon">👤</span>
            No users registered yet.
          </div>
        )}

        {/* User card list – mirrors notif-card-list */}
        {!loading && !error && users.length > 0 && (
          <div className="admin-card-list">
            {users.map((u) => (
              <div key={u.id} className="admin-card">
                {/* Avatar */}
                <div className="admin-card-avatar">
                  {u.pictureUrl ? (
                    <img src={u.pictureUrl} alt={u.name} className="admin-card-avatar-img" />
                  ) : (
                    <span className="admin-card-avatar-placeholder">
                      {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="admin-card-body">
                  <div className="admin-card-name">{u.name}</div>
                  <div className="admin-card-email">{u.email}</div>
                  <div className="admin-card-meta">
                    <span className={`admin-card-role-badge ${u.role === "ADMIN" ? "admin" : "user"}`}>
                      {u.role}
                    </span>
                    <span className="admin-card-id">ID: {u.id}</span>
                  </div>
                </div>

                {/* Role toggle */}
                <div className="admin-card-actions">
                  {u.role === "USER" ? (
                    <button
                      className="admin-card-promote-btn"
                      onClick={() => handleRoleChange(u.id, "ADMIN")}
                    >
                      Promote to Admin
                    </button>
                  ) : (
                    <button
                      className="admin-card-demote-btn"
                      onClick={() => handleRoleChange(u.id, "USER")}
                    >
                      Demote to User
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Module 4 – Notifications admin panel */}
        <AdminNotificationsPanel />
      </div>
      </div>
    </div>
  );
}
