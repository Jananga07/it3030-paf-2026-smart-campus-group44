import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ResourceFormModal from "../M1/components/ResourceFormModal";
import { createResource } from "../M1/api/resourceApi";
// Module 5 – auth for logout
import { useAuth } from "../M5/useAuth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      desc: "View, approve, reject and manage all campus resource bookings.",
      icon: "📋",
      action: () => navigate("/admin"),
    },
    {
      title: "View All Resources",
      desc: "Browse the full catalogue of campus facilities and assets.",
      icon: "🏫",
      action: () => navigate("/admin/resources"),
    },
    {
      title: "Add New Resource",
      desc: "Register a new lecture hall, lab, meeting room or equipment.",
      icon: "➕",
      action: () => setShowAddResource(true),
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">

      {/* Admin Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <span className="text-xl font-extrabold text-indigo-600 tracking-tight">
            🏫 Smart Campus — Admin
          </span>

          {/* Admin links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Booking Management
            </button>
            <button
              onClick={() => navigate("/admin/resources")}
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Resources
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Analytics
            </button>

            {/* Admin info + logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              {user && (
                <span className="text-sm text-gray-600">👋 {user.name}</span>
              )}
              <button
                onClick={async () => { await logout(); navigate("/"); }}
                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="text-center py-24 px-6">
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
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            onClick={card.action}
            className={`bg-white rounded-2xl shadow-md p-7 border cursor-pointer transition duration-200 hover:shadow-lg ${
              card.highlight ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-indigo-50'
            }`}
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className={`text-lg font-bold mb-2 ${card.highlight ? 'text-indigo-700' : 'text-indigo-600'}`}>
              {card.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="text-center py-5 bg-white border-t border-gray-200 text-sm text-gray-400">
        © 2026 Smart Campus System | SLIIT
      </footer>

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
              fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
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
