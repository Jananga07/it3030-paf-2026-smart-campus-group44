import React, { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "./notificationService";
import "./NotificationPanel.css";

/**
 * NotificationPanel – Module 4 (Member 4)
 *
 * Dropdown panel showing the latest notifications.
 * Rendered by NotificationBell when the bell is clicked.
 *
 * Props:
 *   userId       (number)   – current user ID
 *   onClose      (function) – called when panel should close
 *   onViewAll    (function) – called when "View All" is clicked
 *   onCountUpdate(function) – called with new unread count after actions
 */
export default function NotificationPanel({ onClose, onViewAll, onCountUpdate }) {
  // Use userId from localStorage (set by booking system) or default to 1
  const userId = Number(localStorage.getItem("sc_userId") || 1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications(userId);
      setNotifications(data.slice(0, 20)); // show latest 20 in panel
      const unread = data.filter((n) => !n.read).length;
      onCountUpdate && onCountUpdate(unread);
    } catch (err) {
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, [userId, onCountUpdate]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (notification) => {
    if (notification.read) return;
    try {
      await markAsRead(notification.id, userId);
      const updated = notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      const unread = updated.filter((n) => !n.read).length;
      onCountUpdate && onCountUpdate(unread);
    } catch {
      // fail silently in the panel
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId);
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      onCountUpdate && onCountUpdate(0);
    } catch {
      // fail silently
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-panel" role="dialog" aria-label="Notifications panel">
      {/* Header */}
      <div className="notif-panel-header">
        <h3 className="notif-panel-title">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        {unreadCount > 0 && (
          <button className="notif-panel-mark-all" onClick={handleMarkAllAsRead}>
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="notif-panel-body">
        {loading && <div className="notif-panel-loading">Loading…</div>}
        {error && <div className="notif-panel-error">{error}</div>}
        {!loading && !error && notifications.length === 0 && (
          <div className="notif-panel-empty">
            <span className="notif-panel-empty-icon">🔔</span>
            You're all caught up!
          </div>
        )}
        {!loading && !error &&
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item${n.read ? "" : " unread"}`}
              onClick={() => handleMarkAsRead(n)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleMarkAsRead(n)}
            >
              {!n.read && <span className="notif-dot" aria-hidden="true" />}
              <div className="notif-item-content">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-message">{n.message}</div>
                <div className="notif-item-time">{formatTime(n.createdAt)}</div>
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="notif-panel-footer">
        <button className="notif-panel-view-all" onClick={onViewAll}>
          View all notifications →
        </button>
      </div>
    </div>
  );
}
