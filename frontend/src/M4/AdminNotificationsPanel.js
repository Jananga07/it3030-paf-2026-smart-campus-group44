import React, { useState, useEffect, useCallback } from "react";
import {
  getAllNotifications,
  sendNotification,
  adminDeleteNotification,
} from "./notificationAdminService";
import "./AdminNotificationsPanel.css";

/**
 * AdminNotificationsPanel – Module 4 (Member 4)
 *
 * Admin-only panel embedded inside AdminPage (Module 5).
 * Allows admin to:
 *  - View all notifications across all users
 *  - Send a new notification to any user
 *  - Delete any notification
 */

const TYPE_OPTIONS = [
  "BOOKING_APPROVED",
  "BOOKING_REJECTED",
  "TICKET_STATUS_CHANGED",
  "NEW_TICKET_COMMENT",
];

const TYPE_ICON = {
  BOOKING_APPROVED:      "✅",
  BOOKING_REJECTED:      "❌",
  TICKET_STATUS_CHANGED: "🎫",
  NEW_TICKET_COMMENT:    "💬",
};

const EMPTY_FORM = {
  recipientUserId: "",
  type: "BOOKING_APPROVED",
  title: "",
  message: "",
  relatedEntityId: "",
  relatedEntityType: "",
  actionUrl: "",
};

export default function AdminNotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [sending, setSending]             = useState(false);
  const [sendSuccess, setSendSuccess]     = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await adminDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Could not delete notification.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = {
        ...form,
        recipientUserId: Number(form.recipientUserId),
        relatedEntityId: form.relatedEntityId ? Number(form.relatedEntityId) : null,
      };
      const created = await sendNotification(payload);
      setNotifications((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch {
      alert("Could not send notification.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }) : "";

  return (
    <div className="anp-wrapper">
      {/* Header */}
      <div className="anp-header">
        <h2 className="anp-title">🔔 Notifications Management</h2>
        <div className="anp-header-actions">
          {sendSuccess && <span className="anp-success">✅ Notification sent!</span>}
          <button className="anp-btn-send" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "✕ Cancel" : "+ Send Notification"}
          </button>
          <button className="anp-btn-refresh" onClick={load}>↺ Refresh</button>
        </div>
      </div>

      {/* Send form */}
      {showForm && (
        <form className="anp-form" onSubmit={handleSend}>
          <div className="anp-form-row">
            <label>Recipient User ID *</label>
            <input
              type="number" required
              value={form.recipientUserId}
              onChange={(e) => setForm({ ...form, recipientUserId: e.target.value })}
              placeholder="e.g. 1"
            />
          </div>
          <div className="anp-form-row">
            <label>Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{TYPE_ICON[t]} {t}</option>
              ))}
            </select>
          </div>
          <div className="anp-form-row">
            <label>Title *</label>
            <input
              type="text" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notification title"
            />
          </div>
          <div className="anp-form-row">
            <label>Message *</label>
            <textarea
              required rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Notification message"
            />
          </div>
          <div className="anp-form-row anp-form-row-half">
            <div>
              <label>Related Entity ID</label>
              <input
                type="number"
                value={form.relatedEntityId}
                onChange={(e) => setForm({ ...form, relatedEntityId: e.target.value })}
                placeholder="e.g. 42"
              />
            </div>
            <div>
              <label>Related Entity Type</label>
              <input
                type="text"
                value={form.relatedEntityType}
                onChange={(e) => setForm({ ...form, relatedEntityType: e.target.value })}
                placeholder="BOOKING / TICKET"
              />
            </div>
          </div>
          <div className="anp-form-row">
            <label>Action URL</label>
            <input
              type="text"
              value={form.actionUrl}
              onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
              placeholder="/bookings/42"
            />
          </div>
          <button type="submit" className="anp-btn-submit" disabled={sending}>
            {sending ? "Sending…" : "Send Notification"}
          </button>
        </form>
      )}

      {/* Stats */}
      <div className="anp-stats">
        <span className="anp-stat">Total: <b>{notifications.length}</b></span>
        <span className="anp-stat">
          Unread: <b>{notifications.filter((n) => !n.read).length}</b>
        </span>
        <span className="anp-stat">
          Read: <b>{notifications.filter((n) => n.read).length}</b>
        </span>
      </div>

      {/* List */}
      {loading && <div className="anp-loading">Loading notifications…</div>}
      {error   && <div className="anp-error">{error}</div>}

      {!loading && !error && notifications.length === 0 && (
        <div className="anp-empty">No notifications yet.</div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="anp-list">
          {notifications.map((n) => (
            <div key={n.id} className={`anp-item ${n.read ? "read" : "unread"}`}>
              <span className="anp-item-icon">{TYPE_ICON[n.type] || "🔔"}</span>
              <div className="anp-item-body">
                <div className="anp-item-top">
                  <span className="anp-item-title">{n.title}</span>
                  <span className="anp-item-uid">User #{n.recipientUserId}</span>
                </div>
                <div className="anp-item-msg">{n.message}</div>
                <div className="anp-item-meta">
                  <span className="anp-item-time">{formatDate(n.createdAt)}</span>
                  <span className={`anp-item-badge ${n.read ? "read" : "unread"}`}>
                    {n.read ? "Read" : "Unread"}
                  </span>
                  <span className="anp-item-type">{n.type}</span>
                </div>
              </div>
              <button
                className="anp-item-delete"
                onClick={() => handleDelete(n.id)}
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
