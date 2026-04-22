import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "./notificationService";
import NotificationPanel from "./NotificationPanel";
<<<<<<< Updated upstream
import "./NotificationBell.css";
=======
>>>>>>> Stashed changes

/**
 * NotificationBell – Module 4 (Member 4)
 *
<<<<<<< Updated upstream
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
=======
 * Bell icon in the navbar that shows the unread count badge
 * and opens the NotificationPanel dropdown on click.
 *
 * Props:
 *   userId (number) – current user id (passed from Home via auth context)
 */
export default function NotificationBell({ userId = 1 }) {
  const [count, setCount]   = useState(0);
  const [open, setOpen]     = useState(false);
  const wrapperRef          = useRef(null);
  const navigate            = useNavigate();
>>>>>>> Stashed changes

  // Poll unread count every 30 seconds
  useEffect(() => {
    let cancelled = false;
<<<<<<< Updated upstream

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
=======
    const load = () => {
      getUnreadCount(userId)
        .then((c) => { if (!cancelled) setCount(c); })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 30000);
>>>>>>> Stashed changes
    return () => { cancelled = true; clearInterval(interval); };
  }, [userId]);

  // Close panel when clicking outside
  useEffect(() => {
<<<<<<< Updated upstream
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
=======
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "22px", position: "relative", padding: "4px 8px",
        }}
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
      >
        🔔
        {count > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#ef4444", color: "white",
            borderRadius: "50%", fontSize: "10px", fontWeight: 700,
            width: "16px", height: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {count > 9 ? "9+" : count}
>>>>>>> Stashed changes
          </span>
        )}
      </button>

<<<<<<< Updated upstream
      {panelOpen && (
        <NotificationPanel
          userId={userId}
          onClose={handlePanelClose}
          onViewAll={handleViewAll}
          onCountUpdate={handleCountUpdate}
=======
      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          onViewAll={() => { setOpen(false); navigate("/notifications"); }}
          onCountUpdate={setCount}
>>>>>>> Stashed changes
        />
      )}
    </div>
  );
}
