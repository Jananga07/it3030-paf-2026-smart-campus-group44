import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">Smart Campus</h1>

        {/* NEW: Module Buttons */}
        <div className="nav-modules">
          <button className="module-btn">M1</button>
          <button className="module-btn">M2</button>
          <button className="module-btn" onClick={() => navigate('/m3')}>M3</button>
          <button className="module-btn">M4</button>
        </div>

        {/* Existing Buttons */}
        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => navigate('/m3')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/m3')}>Get Started</button>
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
          <button className="btn-primary" onClick={() => navigate('/m3')}>Explore Features</button>
          <button className="btn-outline" onClick={() => navigate('/m3')}>Login with Google</button>
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