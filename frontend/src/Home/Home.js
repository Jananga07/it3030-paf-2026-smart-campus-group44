import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../M5/useAuth";
import sliitMain  from "../components/sliit main.jpg";
import lectureHall from "../components/LectureHall.jpg";
import library     from "../components/Library.jpg";
import computerLab from "../components/ComputerLab.jpg";
import "./Home.css";

/* ── Framer Motion variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ── Floating particles ─────────────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  delay: Math.random() * 12,
  dur: Math.random() * 10 + 12,
}));

/* ── Login gate ─────────────────────────────────────────────── */
function LoginGate({ onClose, onLogin }) {
  return (
    <div className="hp-gate-overlay" onClick={onClose}>
      <motion.div
        className="hp-gate-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <h2>Login Required</h2>
        <p>You need to sign in to access this feature.</p>
        <div className="hp-gate-btns">
          <button className="hbtn hbtn-primary" onClick={onLogin}>Sign In Now</button>
          <button className="hbtn hbtn-outline" onClick={onClose}>Maybe Later</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showGate, setShowGate]       = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);
  const heroRef = useRef(null);

  /* Parallax on hero */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  /* Redirect after login */
  useEffect(() => {
    const r = sessionStorage.getItem("redirectAfterLogin");
    if (user && r) { sessionStorage.removeItem("redirectAfterLogin"); navigate(r); }
  }, [user, navigate]);

  const go = (route, auth) => {
    if (auth && !user) { setPendingRoute(route); setShowGate(true); return; }
    navigate(route);
  };

  const handleLoginRedirect = () => {
    if (pendingRoute) sessionStorage.setItem("redirectAfterLogin", pendingRoute);
    navigate("/login");
  };

  /* ── Data ── */
  const stats = [
    { n: "50+",  l: "Resources" },
    { n: "200+", l: "Bookings/mo" },
    { n: "99%",  l: "Uptime" },
    { n: "24/7", l: "Support" },
  ];

  const campusImages = [
    { title: "Main Campus",  img: sliitMain },
    { title: "Library",      img: library },
    { title: "Lecture Hall", img: lectureHall },
    { title: "Computer Lab", img: computerLab },
  ];

  const features = [
    { title: "View Resources", icon: "🏫", desc: "Browse all campus facilities",       route: "/resources",      auth: false },
    { title: "Book a Resource",icon: "📅", desc: "Reserve spaces in real-time",        route: "/book",           auth: true  },
    { title: "My Bookings",    icon: "📋", desc: "Track all your bookings",            route: "/my-bookings",    auth: true  },
    { title: "Report Issue",   icon: "🛠️", desc: "Submit maintenance requests",        route: "/tickets/create", auth: true  },
    { title: "My Tickets",     icon: "🎫", desc: "Follow up on open tickets",          route: "/tickets",        auth: true  },
    { title: "Notifications",  icon: "🔔", desc: "Stay updated with alerts",           route: "/notifications",  auth: true  },
  ];

  const steps = [
    { n: "1", title: "Sign In",      desc: "Log in with Google or admin credentials." },
    { n: "2", title: "Browse",       desc: "Explore available campus resources." },
    { n: "3", title: "Book",         desc: "Pick a time slot and submit your request." },
    { n: "4", title: "Get Notified", desc: "Receive instant updates on your booking." },
  ];

  return (
    <div className="hp-root">
      {/* ── Watermark background ── */}
      <div className="hp-watermark" />

      {/* ── Background blobs ── */}
      <div className="hp-bg-blobs">
        <div className="hp-blob hp-blob-1" />
        <div className="hp-blob hp-blob-2" />
        <div className="hp-blob hp-blob-3" />
      </div>

      {/* ── Particles ── */}
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

        {/* ══ HERO ══ */}
        <motion.section className="hp-hero" ref={heroRef} style={{ y: heroY }}>

          <motion.div className="hp-badge"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            ✦ SLIIT Smart Campus System
          </motion.div>

          <motion.h1 className="hp-title"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}>
            <motion.span
              className="hp-title-line"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}>
              Campus Operations
            </motion.span>
            <br />
            <motion.span
              className="hl-blue"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}>
              Smarter
            </motion.span>
            <motion.span
              className="hp-title-amp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.3 }}>
              {" "}&amp;{" "}
            </motion.span>
            <motion.span
              className="hl-purple"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.75, duration: 0.55, ease: "easeOut" }}>
              Faster
            </motion.span>
          </motion.h1>

          <motion.p className="hp-sub"
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.95, duration: 0.7, ease: "easeOut" }}>
            Book resources, report incidents, and manage campus facilities —{" "}
            <motion.span
              className="hp-sub-highlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}>
              all from one modern platform
            </motion.span>{" "}
            built for students and staff.
          </motion.p>

          <motion.div className="hp-cta"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}>
            <button className="hbtn hbtn-primary" onClick={() => navigate("/resources")}>
              🏫 View Resources
            </button>
            {user ? (
              <>
                <button className="hbtn hbtn-outline" onClick={() => navigate("/my-bookings")}>
                  📋 My Bookings
                </button>
                {user.role === "ADMIN" && (
                  <button className="hbtn hbtn-outline" onClick={() => navigate("/admin-dashboard")}>
                    🛡️ Admin Panel
                  </button>
                )}
                <button className="hbtn hbtn-danger hbtn-sm" onClick={logout}>Logout</button>
              </>
            ) : (
              <button className="hbtn hbtn-outline" onClick={() => navigate("/login")}>
                🔐 Sign In
              </button>
            )}
          </motion.div>


          {/* Stats removed */}
        </motion.section>

        {/* ══ GALLERY ══ */}
        <section className="hp-section">
          <motion.div className="hp-section-head"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2>Explore Our Campus</h2>
            <p>World-class facilities for world-class education</p>
          </motion.div>

          <motion.div className="hp-gallery"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {campusImages.map((item, i) => (
              <motion.div
                key={i}
                className="hp-gallery-card"
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.88, rotateX: 8 },
                  show:   { opacity: 1, y: 0,  scale: 1, rotateX: 0,
                    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{
                  y: -14,
                  scale: 1.04,
                  boxShadow: "0 24px 60px rgba(59,130,246,0.28)",
                  transition: { type: "spring", stiffness: 280, damping: 18 }
                }}
              >
                <motion.img
                  src={item.img}
                  alt={item.title}
                  whileHover={{ scale: 1.14 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                <div className="hp-gallery-shimmer" />
                <div className="hp-gallery-overlay">
                  <motion.span
                    className="hp-gallery-label"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}>
                    {item.title}
                  </motion.span>
                </div>
                {/* Animated border glow on hover */}
                <motion.div
                  className="hp-gallery-glow"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="hp-section">
          <motion.div className="hp-section-head"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2>Everything You Need</h2>
            <p>All campus management tools in one place</p>
          </motion.div>

          <motion.div className="hp-grid"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {features.map((f, i) => (
              <motion.div key={i} className="hp-card" variants={fadeUp}
                whileHover={{ y: -8 }}
                onClick={() => go(f.route, f.auth)}>
                <div className="hp-card-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{f.desc}</p>
                <div className="hp-card-arrow">
                  {f.auth && !user ? "🔒 Login to access" : "Explore →"}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="hp-section">
          <motion.div className="hp-section-head"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2>How It Works</h2>
            <p>Get started in four simple steps</p>
          </motion.div>

          <motion.div className="hp-steps"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {steps.map((s, i) => (
              <motion.div key={i} className="hp-step" variants={fadeUp}>
                <div className="hp-step-num">{s.n}</div>
                <div className="hp-step-title">{s.title}</div>
                <div className="hp-step-desc">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ CTA BANNER (guests only) ══ */}
        {!user && (
          <div className="hp-cta-banner">
            <motion.div className="hp-cta-inner"
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={scaleIn}>
              <h2>Ready to get started?</h2>
              <p>Sign in with your Google account to access all campus services instantly.</p>
              <div className="hp-cta-btns">
                <button className="hbtn hbtn-primary" onClick={() => navigate("/login")}>
                  🔐 Sign In with Google
                </button>
                <button className="hbtn hbtn-outline" onClick={() => navigate("/resources")}>
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

      {/* ── Login gate ── */}
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
