import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ResourceFormModal from "../M1/components/ResourceFormModal";
import { createResource } from "../M1/api/resourceApi";
import { useAuth } from "../M5/useAuth";

// ── Admin Sidebar ─────────────────────────────────────────────────────────────
function AdminSidebar() {
  const navigate   = useNavigate();
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

// ── Admin Dashboard Page ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showAddResource, setShowAddResource] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateResource = async (formData) => {
    try {
      await createResource(formData);
      setShowAddResource(false);
      showToast("Resource created successfully!");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const cards = [
    {
      title: "Booking Management",
      desc:  "View, approve, reject and manage all campus resource bookings.",
      icon:  "📋",
      action: () => navigate("/admin"),
    },
    {
      title: "View All Resources",
      desc:  "Browse the full catalogue of campus facilities and assets.",
      icon:  "🏫",
      action: () => navigate("/admin/resources"),
    },
    {
      title: "Add New Resource",
      desc:  "Register a new lecture hall, lab, meeting room or equipment.",
      icon:  "➕",
      action: () => setShowAddResource(true),
      highlight: true,
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main style={{ flex: 1, background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)" }}>
        {/* Hero */}
        <section className="text-center py-20 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-gray-800 leading-tight"
          >
            Admin <span className="text-indigo-600">Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg text-gray-500 max-w-xl mx-auto"
          >
            Manage and oversee all Smart Campus operations from one place.
          </motion.p>
        </section>

        {/* Cards */}
        <section className="max-w-4xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              onClick={card.action}
              className={`bg-white rounded-2xl shadow-md p-7 border cursor-pointer transition duration-200 hover:shadow-lg ${
                card.highlight ? "border-indigo-400 ring-2 ring-indigo-100" : "border-indigo-50"
              }`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${card.highlight ? "text-indigo-700" : "text-indigo-600"}`}>
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </section>

        <footer className="text-center py-5 bg-white border-t border-gray-200 text-sm text-gray-400">
          © 2026 Smart Campus System | SLIIT
        </footer>
      </main>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddResource && (
          <ResourceFormModal
            resource={null}
            onClose={() => setShowAddResource(false)}
            onSave={handleCreateResource}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={{
              position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
              background: toast.type === "error" ? "#ef4444" : "#10b981",
              color: "#fff", padding: "12px 28px", borderRadius: 12,
              fontWeight: 600, fontSize: 14, zIndex: 9999,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
