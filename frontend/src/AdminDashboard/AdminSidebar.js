import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../M5/useAuth";

/**
 * AdminSidebar – shared sidebar for all admin pages.
 * Import and render this at the top of any admin page layout.
 */
export default function AdminSidebar() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: "🏠", label: "Dashboard",          path: "/admin-dashboard" },
    { icon: "📋", label: "Booking Management", path: "/admin" },
    { icon: "🏫", label: "Resources",          path: "/admin/resources" },
    { icon: "📊", label: "Analytics",          path: "/analytics" },
  ];

  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "#1e1b4b",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #312e81" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>🏫 Smart Campus</div>
        <div style={{ fontSize: 11, color: "#a5b4fc", marginTop: 4 }}>Admin Portal</div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, border: "none",
                background: active ? "#4f46e5" : "transparent",
                color: active ? "#fff" : "#c7d2fe",
                fontSize: 14, fontWeight: active ? 700 : 500,
                cursor: "pointer", textAlign: "left", width: "100%",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#312e81"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #312e81" }}>
        {user && (
          <div style={{ fontSize: 13, color: "#a5b4fc", marginBottom: 10 }}>
            👋 {user.name}
          </div>
        )}
        <button
          onClick={async () => { await logout(); navigate("/"); }}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8,
            border: "1px solid #ef4444", background: "transparent",
            color: "#fca5a5", fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fca5a5"; }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
