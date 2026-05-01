import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notificationService";
import "./NotificationsPage.css";

const TYPE_ICON = {
  BOOKING_APPROVED:      "✅",
  BOOKING_REJECTED:      "❌",
  BOOKING_CANCELLED:     "🚫",
  TICKET_STATUS_CHANGED: "🎫",
  NEW_TICKET_COMMENT:    "💬",
};

const TYPE_LABEL = {
  BOOKING_APPROVED:      "Booking",
  BOOKING_REJECTED:      "Booking",
  BOOKING_CANCELLED:     "Booking",
  TICKET_STATUS_CHANGED: "Ticket",
  NEW_TICKET_COMMENT:    "Ticket",
};

/**
 * NotificationsPage – Module 4 (Member 4)
 *
 * Full-page view for all user notifications.
 * Route: /notifications
 *
 * Props: None (userId resolved from auth context – Module 5 integration)
 */
export default function NotificationsPage() {
  const userId = Number(localStorage.getItem("sc_userId") || 1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      alert("Could not mark notification as read. Please try again.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      alert("Could not mark all notifications as read. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteNotification(id, userId);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Could not delete notification. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const displayed = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-page">
      {/* Page header */}
      <div className="notif-page-header">
        <button className="notif-page-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="notif-page-title">
          🔔 Notifications{unreadCount > 0 ? ` (${unreadCount} unread)` : ""}
        </h1>
      </div>

      <div className="notif-page-content">
        {/* Controls */}
        <div className="notif-page-controls">
          <div className="notif-page-filter">
            <button
              className={`notif-filter-btn${filter === "all" ? " active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`notif-filter-btn${filter === "unread" ? " active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
          </div>

          <div className="notif-page-actions">
            {unreadCount > 0 && (
              <button className="notif-page-action-btn" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
            <button className="notif-page-action-btn" onClick={loadNotifications}>
              ↺ Refresh
            </button>
          </div>
        </div>

        {/* Body */}
        {loading && <div className="notif-page-loading">Loading notifications…</div>}
        {error && <div className="notif-page-error">{error}</div>}

        {!loading && !error && displayed.length === 0 && (
          <div className="notif-page-empty">
            <span className="notif-page-empty-icon">
              {filter === "unread" ? "✅" : "🔔"}
            </span>
            {filter === "unread"
              ? "No unread notifications — you're all caught up!"
              : "No notifications yet."}
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="notif-card-list">
            {displayed.map((n) => (
              <div
                key={n.id}
                className={`notif-card ${n.read ? "read" : "unread"}`}
                onClick={() => !n.read && handleMarkAsRead(n.id)}
              >
                {/* Icon */}
                <span className="notif-card-icon">
                  {TYPE_ICON[n.type] || "🔔"}
                </span>

                {/* Content */}
                <div className="notif-card-body">
                  <div className="notif-card-title">{n.title}</div>
                  <div className="notif-card-message">{n.message}</div>
                  <div className="notif-card-meta">
                    <span className="notif-card-time">
                      {formatDate(n.createdAt)}
                    </span>
                    <span className="notif-card-type">
                      {TYPE_LABEL[n.type] || n.type}
                    </span>
                    {n.read && (
                      <span className="notif-card-type" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                        Read
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="notif-card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!n.read && (
                    <button
                      className="notif-card-read-btn"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    className="notif-card-delete-btn"
                    onClick={() => handleDelete(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
