import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// Module 4 – Notifications (Member 4)
import NotificationBell from "../M4/NotificationBell";
// Module 5 – Auth (Member 5)
import { useAuth } from "../M5/useAuth";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">Smart Campus</h1>

        {/* NEW: Module Buttons */}
        <div className="nav-modules">
          <button className="module-btn">M1</button>
          <button className="module-btn">M2</button>
          <button className="module-btn">M3</button>
          <button className="module-btn">M4</button>
        </div>

        {/* Existing Buttons + Module 4 Notification Bell */}
        <div className="nav-buttons">
          {/* Pass real userId from auth context; fall back to 1 if not logged in */}
          <NotificationBell userId={user ? user.id : 1} />

          {user ? (
            <>
              <span className="nav-user-name">{user.name}</span>
              {user.role === "ADMIN" && (
                <button
                  className="nav-role-badge"
                  onClick={() => navigate("/admin")}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  Admin Panel
                </button>
              )}
              <button className="btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <button
              className="btn-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Smart Campus Operations Hub
        </motion.h1>

        <p>
          Manage facilities, book resources, report incidents, and stay updated
          with a modern campus management system.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Explore Features</button>
          {!user && (
            <button
              className="btn-outline"
              onClick={() => navigate("/login")}
            >
              Login with Google
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        {[
          {
            title: "Resource Booking",
            desc: "Easily book lecture halls, labs, and equipment with real-time availability.",
          },
          {
            title: "Incident Reporting",
            desc: "Report issues with images and track resolution progress efficiently.",
          },
          {
            title: "Smart Notifications",
            desc: "Get instant updates on bookings, tickets, and system activities.",
          },
        ].map((feature, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Smart Campus System | SLIIT</p>
      </footer>
    </div>
  );
}
