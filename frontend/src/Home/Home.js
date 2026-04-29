import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../M5/useAuth";
import "./Home.css";

/* ── Floating particles ─────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 14,
  dur: Math.random() * 10 + 12,
}));

/* ── Login gate modal ───────────────────────────────────────────── */
function LoginGate({ onClose, onLogin }) {
  return (
    <div className="hp-gate-overlay" onClick={onClose}>
      <motion.div
        className="hp-gate-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 24 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="hp-gate-icon">🔐</div>
        <h2 className="hp-gate-title">Login Required</h2>
        <p className="hp-gate-sub">
          You need to sign in to access this feature.<br />
          Please log in to continue.
        </p>
        <div className="hp-gate-btns">
          <button className="hbtn hbtn-primary" onClick={onLogin}>
            Sign In Now
          </button>
          <button className="hbtn hbtn-outline" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showGate, setShowGate] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  /* redirect after login */
  useEffect(() => {
    const r = sessionStorage.getItem("redirectAfterLogin");
    if (user && r) {
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(r);
    }
  }, [user, navigate]);

  const go = (route, needsAuth) => {
    if (needsAuth && !user) {
      setPendingRoute(route);
      setShowGate(true);
      return;
    }
    navigate(route);
  };

  const handleLoginRedirect = () => {
    if (pendingRoute) sessionStorage.setItem("redirectAfterLogin", pendingRoute);
    navigate("/login");
  };

  /* ── data ── */
  const features = [
    {
      icon: "🏫", title: "View Resources",
      desc: "Browse all campus lecture halls, labs, meeting rooms and equipment.",
      color: "#6366f1", route: "/resources", auth: false,
    },
    {
      icon: "📅", title: "Book a Resource",
      desc: "Reserve your preferred space with real-time availability checks.",
      color: "#8b5cf6", route: "/book", auth: true,
    },
    {
      icon: "📋", title: "My Bookings",
      desc: "Track all your active, pending and past bookings in one place.",
      color: "#06b6d4", route: "/my-bookings", auth: true,
    },
    {
      icon: "🛠️", title: "Report Incident",
      desc: "Submit maintenance requests and track their resolution progress.",
      color: "#f59e0b", route: "/tickets/create", auth: true,
    },
    {
      icon: "🎫", title: "My Tickets",
      desc: "View all submitted tickets and follow up on ongoing issues.",
      color: "#10b981", route: "/tickets", auth: true,
    },
    {
      icon: "🔔", title: "Notifications",
      desc: "Stay updated with real-time alerts on bookings and campus news.",
      color: "#ec4899", route: "/notifications", auth: true,
    },
  ];

  const steps = [
    { n: "1", t: "Sign In",      d: "Log in with Google or admin credentials." },
    { n: "2", t: "Browse",       d: "Explore available campus resources." },
    { n: "3", t: "Book",         d: "Pick a time slot and submit your request." },
    { n: "4", t: "Get Notified", d: "Receive instant updates on your booking." },
  ];

  const stats = [
    { n: "50+",  l: "Resources" },
    { n: "200+", l: "Bookings/mo" },
    { n: "99%",  l: "Uptime" },
    { n: "24/7", l: "Support" },
  ];

  return (
    <div className="hp-root">
      {/* background layers */}
      <div className="hp-bg" />
      <div className="hp-orb hp-orb-1" />
      <div className="hp-orb hp-orb-2" />
      <div className="hp-orb hp-orb-3" />
      <div className="hp-particles">
        {PARTICLES.map((p) => (
          <div key={p.id} className="hp-particle" style={{
            width: p.size, height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }} />
        ))}
      </div>

      <div className="hp-content">

        {/* ── HERO ── */}
        <section className="hp-hero">

          {/* user pill or badge */}
          {user ? (
            <motion.div className="hp-user-pill"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {user.pictureUrl
                ? <img src={user.pictureUrl} alt={user.name} className="hp-user-avatar" />
                : <span style={{ fontSize: 22 }}>👤</span>}
              <span className="hp-user-name">{user.name}</span>
              <span className="hp-user-role">{user.role}</span>
            </motion.div>
          ) : (
            <motion.div className="hp-badge"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              ✦ SLIIT Smart Campus System
            </motion.div>
          )}

          <motion.h1 className="hp-title"
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}>
            Campus Operations<br />
            <span className="hl">Reimagined</span>
          </motion.h1>

          <motion.p className="hp-sub"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.6 }}>
            Book resources, report incidents, and manage campus facilities —
            all from one modern platform built for students and staff.
          </motion.p>

          {/* CTA buttons */}
          <motion.div className="hp-cta"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}>

            <button className="hbtn hbtn-primary"
              onClick={() => navigate("/resources")}>
              🏫 View Resources
            </button>

            {user ? (
              <>
                <button className="hbtn hbtn-outline"
                  onClick={() => navigate("/my-bookings")}>
                  📋 My Bookings
                </button>
                {user.role === "ADMIN" && (
                  <button className="hbtn hbtn-outline"
                    onClick={() => navigate("/admin-dashboard")}>
                    🛡️ Admin Panel
                  </button>
                )}
                <button className="hbtn hbtn-danger hbtn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="hbtn hbtn-outline"
                  onClick={() => navigate("/bookings")}>
                  📋 View Bookings
                </button>
                <button className="hbtn hbtn-outline"
                  onClick={() => navigate("/login")}>
                  🔐 Sign In
                </button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div className="hp-stats"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.5 }}>
            {stats.map((s, i) => (
              <div key={i} className="hp-stat">
                <div className="hp-stat-n">{s.n}</div>
                <div className="hp-stat-l">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── FEATURES ── */}
        <section className="hp-section">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="hp-section-title">Everything You Need</h2>
            <p className="hp-section-sub">All campus tools in one place</p>
          </motion.div>

          <div className="hp-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="hp-card"
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.42 }}
                onClick={() => go(f.route, f.auth)}>
                <div className="hp-card-glow"
                  style={{ background: `radial-gradient(circle, ${f.color}, transparent 70%)` }} />
                <div className="hp-card-icon" style={{ background: `${f.color}1a` }}>
                  {f.icon}
                </div>
                <div className="hp-card-title">{f.title}</div>
                <div className="hp-card-desc">{f.desc}</div>
                <div className="hp-card-foot" style={{ color: f.color }}>
                  {f.auth && !user ? "🔒 Login to access" : "Explore →"}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="hp-section">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="hp-section-title">How It Works</h2>
            <p className="hp-section-sub">Get started in four simple steps</p>
          </motion.div>

          <div className="hp-steps">
            {steps.map((s, i) => (
              <motion.div key={i} className="hp-step"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.4 }}>
                <div className="hp-step-n">{s.n}</div>
                <div className="hp-step-t">{s.t}</div>
                <div className="hp-step-d">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER (guests only) ── */}
        {!user && (
          <div className="hp-cta-banner">
            <motion.div className="hp-cta-inner"
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="hp-cta-t">Ready to get started?</h2>
              <p className="hp-cta-s">
                Sign in with your Google account to access all campus services instantly.
              </p>
              <div className="hp-cta-btns">
                <button className="hbtn hbtn-primary"
                  onClick={() => navigate("/login")}>
                  🔐 Sign In with Google
                </button>
                <button className="hbtn hbtn-outline"
                  onClick={() => navigate("/resources")}>
                  🏫 Browse Resources
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <footer className="hp-footer">
          © 2026 Smart Campus Operations Hub · SLIIT
        </footer>
      </div>

      {/* ── LOGIN GATE ── */}
      <AnimatePresence>
        {showGate && (
          <LoginGate
            onClose={() => setShowGate(false)}
            onLogin={handleLoginRedirect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
