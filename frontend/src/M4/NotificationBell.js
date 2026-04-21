import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "./notificationService";
import NotificationPanel from "./NotificationPanel";
import "./NotificationBell.css";

/**
 * NotificationBell – Module 4 (Member 4)
 *
 * Renders a bell icon in the navbar with a red unread badge.
 * Clicking toggles the NotificationPanel dropdown.
 *
 * Props:
 *   userId (number) – the current user's ID. Replace with auth context once available.
 */
export default function NotificationBell({ userId = 1 }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Poll unread count every 30 seconds
  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const count = await getUnreadCount(userId);
        if (!cancelled) setUnreadCount(count);
      } catch {
        // silently fail — bell still renders without count
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [userId]);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePanelClose = () => setPanelOpen(false);

  const handleViewAll = () => {
    setPanelOpen(false);
    navigate("/notifications");
  };

  const handleCountUpdate = (newCount) => setUnreadCount(newCount);

  return (
    <div className="notif-bell-wrapper" ref={wrapperRef}>
      <button
        className="notif-bell-btn"
        onClick={() => setPanelOpen((open) => !open)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && (
        <NotificationPanel
          userId={userId}
          onClose={handlePanelClose}
          onViewAll={handleViewAll}
          onCountUpdate={handleCountUpdate}
        />
      )}
    </div>
  );
}
