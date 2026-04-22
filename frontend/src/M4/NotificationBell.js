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
 *   userId (number) – current user id (passed from Home via auth context)
 */
export default function NotificationBell({ userId = 1 }) {
  const [count, setCount] = useState(0);
  const [open, setOpen]   = useState(false);
  const wrapperRef        = useRef(null);
  const navigate          = useNavigate();

  // Poll unread count every 30 seconds
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getUnreadCount(userId)
        .then((c) => { if (!cancelled) setCount(c); })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [userId]);

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="notif-bell-wrapper" ref={wrapperRef}>
      <button
        className="notif-bell-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
        title="Notifications"
      >
        🔔
        {count > 0 && (
          <span className="notif-badge">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          onViewAll={() => { setOpen(false); navigate("/notifications"); }}
          onCountUpdate={setCount}
        />
      )}
    </div>
  );
}
