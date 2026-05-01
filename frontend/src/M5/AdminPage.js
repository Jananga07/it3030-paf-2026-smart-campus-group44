import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "./authService";
import "./AdminPage.css";
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

        {/* User card list grouped by role */}
        {!loading && !error && users.length > 0 && (
          <>
            {[
              { role: 'ADMIN',      label: '🛡️ Admins',      cls: 'admin' },
              { role: 'TECHNICIAN', label: '👷 Technicians',  cls: 'tech' },
              { role: 'USER',       label: '👤 Users',        cls: 'user' },
            ].map(({ role, label, cls }) => {
              const group = users.filter(u => u.role === role);
              if (group.length === 0) return null;
              return (
                <div key={role} style={{ marginBottom: 28 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.6px',
                    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    {label}
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      background: '#eff6ff', color: '#3b82f6',
                      border: '1px solid #bfdbfe',
                      padding: '2px 8px', borderRadius: 20
                    }}>{group.length}</span>
                  </div>
                  <div className="admin-card-list">
                    {group.map((u) => (
                      <div key={u.id} className="admin-card">
                        <div className="admin-card-avatar">
                          {u.pictureUrl ? (
                            <img src={u.pictureUrl} alt={u.name} className="admin-card-avatar-img" />
                          ) : (
                            <span className="admin-card-avatar-placeholder">
                              {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                            </span>
                          )}
                        </div>
                        <div className="admin-card-body">
                          <div className="admin-card-name">{u.name}</div>
                          <div className="admin-card-email">{u.email}</div>
                          <div className="admin-card-meta">
                            <span className={`admin-card-role-badge ${cls}`}>{u.role}</span>
                            <span className="admin-card-id">ID: {u.id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

      </div>
      </div>
    </div>
  );
}
