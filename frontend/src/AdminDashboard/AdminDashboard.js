import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../M5/useAuth";
import { getAuthHeader } from "../M5/authService";
import { getAllResources, createResource } from "../M1/api/resourceApi";
import { getAllBookings } from "../M2/api/bookingApi";
import ResourceFormModal from "../M1/components/ResourceFormModal";
import AdminSidebar from "./AdminSidebar";
import "./AdminDashboard.css";

const ADMIN_API = "http://localhost:8080/api/admin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showAddResource, setShowAddResource] = useState(false);
  const [toast, setToast]                     = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    users: "—", resources: "—", bookings: "—", pending: "—",
  });
  const [statusCount, setStatusCount] = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load stats on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, resources, bookings] = await Promise.allSettled([
          fetch(`${ADMIN_API}/users`, { headers: { ...getAuthHeader() } }).then(r => r.json()),
          getAllResources(),
          getAllBookings(),
        ]);

        const userCount     = usersRes.status     === "fulfilled" ? usersRes.value.length     : "—";
        const resourceCount = resources.status    === "fulfilled" ? resources.value.length    : "—";
        const bookingCount  = bookings.status     === "fulfilled" ? bookings.value.length     : "—";
        const pendingCount  = bookings.status     === "fulfilled"
          ? bookings.value.filter(b => b.status === "PENDING").length
          : "—";

        // Status counts for Booking Health chart
        if (bookings.status === "fulfilled") {
          const sc = bookings.value.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1;
            return acc;
          }, {});
          setStatusCount(sc);
        }

        setStats({
          users:     userCount,
          resources: resourceCount,
          bookings:  bookingCount,
          pending:   pendingCount,
        });
      } catch (e) {
        console.error("Stats load failed", e);
      }
    };
    load();
  }, []);

  const handleCreateResource = async (formData) => {
    try {
      await createResource(formData);
      setShowAddResource(false);
      showToast("Resource created successfully!");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // Nav cards
  const navCards = [
    { icon: "📋", title: "Booking Management",  desc: "Approve, reject and manage all bookings.",         path: "/admin",                   highlight: false },
    { icon: "🏫", title: "View All Resources",   desc: "Browse the full campus resource catalogue.",       path: "/admin/resources",         highlight: false },
    { icon: "➕", title: "Add New Resource",     desc: "Register a new hall, lab or equipment.",           path: null,                       highlight: true,  action: () => setShowAddResource(true) },
    { icon: "👥", title: "User Management",      desc: "Manage roles and registered users.",               path: "/admin/auth",              highlight: false },
    { icon: "📊", title: "Analytics",            desc: "View booking trends and usage statistics.",        path: "/analytics",               highlight: false },
    { icon: "🎫", title: "Ticket Categories",    desc: "Manage maintenance ticket categories.",            path: "/admin/ticket-categories", highlight: false },
  ];

  // Recent activity (static — replace with real API if available)
  const activity = [
    { dot: "blue",   text: "New booking request submitted for Lab A-201",    time: "2 min ago" },
    { dot: "green",  text: "Booking #42 approved by admin",                  time: "15 min ago" },
    { dot: "amber",  text: "Resource 'Meeting Room B' marked out of service", time: "1 hr ago" },
    { dot: "red",    text: "Booking #38 rejected — time conflict",            time: "2 hr ago" },
    { dot: "purple", text: "New user registered via Google OAuth",            time: "3 hr ago" },
  ];

  const statCards = [
    { icon: "👥", label: "Total Users",     value: stats.users,     color: "blue",   trend: "Registered accounts" },
    { icon: "🏫", label: "Total Resources", value: stats.resources, color: "purple", trend: "Campus facilities" },
    { icon: "📋", label: "Total Bookings",  value: stats.bookings,  color: "green",  trend: "All time" },
    { icon: "⏳", label: "Pending",         value: stats.pending,   color: "amber",  trend: "Awaiting approval" },
  ];

  return (
    <div className="ad-root">
      <AdminSidebar />

      <div className="ad-main">
        {/* ── Top bar ── */}
        <div className="ad-topbar">
          <div className="ad-topbar-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name || "Admin"} — here's what's happening today.</p>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-topbar-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="ad-topbar-name">{user?.name || "Admin"}</span>
            <button className="ad-topbar-logout" onClick={async () => { await logout(); navigate("/login"); }}>Logout</button>
          </div>
        </div>

        <div className="ad-body">

          {/* ── Stats ── */}
          <div>
            <p className="ad-section-title">Overview</p>
            <div className="ad-stats">
              {statCards.map((s, i) => (
                <motion.div key={i} className="ad-stat-card"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <div className={`ad-stat-icon ad-stat-icon-${s.color}`}>{s.icon}</div>
                  <div className="ad-stat-info">
                    <div className="ad-stat-value">{s.value}</div>
                    <div className="ad-stat-label">{s.label}</div>
                    <div className="ad-stat-trend">{s.trend}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Middle: nav cards + quick actions ── */}
          <div className="ad-middle">
            <div>
              <p className="ad-section-title">Management</p>
              <div className="ad-nav-grid">
                {navCards.map((card, i) => (
                  <motion.div key={i}
                    className={`ad-nav-card${card.highlight ? " ad-nav-card-highlight" : ""}`}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={card.action || (() => navigate(card.path))}>
                    <div className="ad-nav-icon">{card.icon}</div>
                    <div className="ad-nav-title">{card.title}</div>
                    <div className="ad-nav-desc">{card.desc}</div>
                    <div className="ad-nav-arrow">Go →</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="ad-section-title">System Status</p>
              <div className="ad-quick-panel">
                <div className="ad-sys-status-list">
                  <div className="ad-sys-status-item">
                    <div className="ad-sys-status-dot ad-sys-dot-green" />
                    <div className="ad-sys-status-info">
                      <span className="ad-sys-status-name">Booking Service</span>
                      <span className="ad-sys-status-state ad-sys-state-ok">Operational</span>
                    </div>
                  </div>
                  <div className="ad-sys-status-item">
                    <div className="ad-sys-status-dot ad-sys-dot-green" />
                    <div className="ad-sys-status-info">
                      <span className="ad-sys-status-name">Resource Service</span>
                      <span className="ad-sys-status-state ad-sys-state-ok">Operational</span>
                    </div>
                  </div>
                  <div className="ad-sys-status-item">
                    <div className="ad-sys-status-dot ad-sys-dot-green" />
                    <div className="ad-sys-status-info">
                      <span className="ad-sys-status-name">Auth Service</span>
                      <span className="ad-sys-status-state ad-sys-state-ok">Operational</span>
                    </div>
                  </div>
                  <div className="ad-sys-status-item">
                    <div className="ad-sys-status-dot ad-sys-dot-amber" />
                    <div className="ad-sys-status-info">
                      <span className="ad-sys-status-name">Email Notifications</span>
                      <span className="ad-sys-status-state ad-sys-state-warn">Check Config</span>
                    </div>
                  </div>
                  <div className="ad-sys-status-item">
                    <div className="ad-sys-status-dot ad-sys-dot-green" />
                    <div className="ad-sys-status-info">
                      <span className="ad-sys-status-name">Database</span>
                      <span className="ad-sys-status-state ad-sys-state-ok">Connected</span>
                    </div>
                  </div>
                </div>

                <div className="ad-sys-divider" />

                <div className="ad-sys-meta">
                  <div className="ad-sys-meta-row">
                    <span className="ad-sys-meta-label">Total Resources</span>
                    <span className="ad-sys-meta-value">{stats.resources}</span>
                  </div>
                  <div className="ad-sys-meta-row">
                    <span className="ad-sys-meta-label">Pending Approvals</span>
                    <span className="ad-sys-meta-value ad-sys-meta-warn">{stats.pending}</span>
                  </div>
                  <div className="ad-sys-meta-row">
                    <span className="ad-sys-meta-label">Registered Users</span>
                    <span className="ad-sys-meta-value">{stats.users}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom: activity + booking health ── */}
          <div className="ad-bottom">
            <div>
              <p className="ad-section-title">Recent Activity</p>
              <div className="ad-activity-panel">
                <div className="ad-activity-list">
                  {activity.map((a, i) => (
                    <div key={i} className="ad-activity-item">
                      <div className={`ad-activity-dot ad-activity-dot-${a.dot}`} />
                      <div>
                        <div className="ad-activity-text">{a.text}</div>
                        <div className="ad-activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="ad-section-title">Booking Health</p>
              <div className="ad-health-panel">
                {stats.bookings === "—" || stats.bookings === 0 ? (
                  <div className="ad-health-empty">No booking data yet</div>
                ) : (
                  <div className="ad-health-grid">
                    {[
                      { label: "Approval Rate",     key: "APPROVED",  color: "#10b981", bg: "#f0fdf4", icon: "✅" },
                      { label: "Pending Rate",      key: "PENDING",   color: "#f59e0b", bg: "#fffbeb", icon: "⏳" },
                      { label: "Rejection Rate",    key: "REJECTED",  color: "#ef4444", bg: "#fef2f2", icon: "❌" },
                      { label: "Cancellation Rate", key: "CANCELLED", color: "#94a3b8", bg: "#f8fafc", icon: "🚫" },
                    ].map(({ label, key, color, bg, icon }) => {
                      const count = statusCount[key] || 0;
                      const total = typeof stats.bookings === "number" ? stats.bookings : 0;
                      const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={key} className="ad-health-item"
                          style={{ background: bg, borderColor: color + "33" }}>
                          <span className="ad-health-icon">{icon}</span>
                          <div className="ad-health-pct" style={{ color }}>{pct}%</div>
                          <div className="ad-health-label">{label}</div>
                          <div className="ad-health-count">{count} bookings</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Add Resource Modal ── */}
      <AnimatePresence>
        {showAddResource && (
          <ResourceFormModal
            resource={null}
            onClose={() => setShowAddResource(false)}
            onSave={handleCreateResource}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`ad-toast ad-toast-${toast.type}`}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
