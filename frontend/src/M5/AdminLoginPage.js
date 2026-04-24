import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "./authService";
import { useAuth } from "./useAuth";
import "./LoginPage.css";

/**
 * AdminLoginPage – Module 5 (Member 5)
 * Route: /admin-login
 *
 * Admin login + register page.
 * - Register: creates account, then admin must be promoted via H2 console
 * - Login: email + password, ADMIN role only
 */

const API = "http://localhost:8080/api/auth";

// ── Register form ─────────────────────────────────────────────────────────────
function AdminRegisterForm({ onRegistered }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/register?role=admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }

      setSuccess(`Admin account created for ${email}. You can now Sign In.`);
      onRegistered(email);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Full Name</label>
        <input type="text" required value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Admin Name" />
      </div>
      <div className="auth-field">
        <label>Email</label>
        <input type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com" />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters" />
      </div>
      <div className="auth-field">
        <label>Confirm Password</label>
        <input type="password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password" />
      </div>
      {error   && <div className="auth-error">{error}</div>}
      {success && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          color: "#15803d", borderRadius: 8, padding: "10px 12px",
          fontSize: 13, textAlign: "center",
        }}>
          ✅ {success}
        </div>
      )}
      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Creating account…" : "Create Admin Account"}
      </button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const navigate    = useNavigate();
  const { setUser } = useAuth();
  const [tab, setTab]           = useState("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }

      if (data.user.role !== "ADMIN") {
        setError("Access denied. This account does not have admin privileges.");
        return;
      }

      saveToken(data.token);
      setUser(data.user);
      navigate("/admin-dashboard", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <div className="login-page-header">
        <button className="login-page-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="login-page-title">🛡️ Admin Portal</h1>
      </div>

      <div className="login-page-content">
        <div className="login-card">
          <div className="login-card-icon">🔒</div>
          <h2 className="login-card-heading">Administrator Access</h2>
          <p className="login-card-sub">
            Restricted to system administrators only.
          </p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${tab === "signin" ? " active" : ""}`}
              onClick={() => { setTab("signin"); setError(""); }}>
              Sign In
            </button>
            <button className={`auth-tab${tab === "register" ? " active" : ""}`}
              onClick={() => { setTab("register"); setError(""); }}>
              Register
            </button>
          </div>

          {/* Sign In form */}
          {tab === "signin" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label>Admin Email</label>
                <input type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com" />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Signing in…" : "Sign In as Admin"}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <AdminRegisterForm
              onRegistered={(registeredEmail) => {
                setEmail(registeredEmail);
                setTab("signin");
              }}
            />
          )}

          <p style={{ marginTop: 16, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
            Not an admin?{" "}
            <button
              style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontSize: 12 }}
              onClick={() => navigate("/login")}
            >
              User Login →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
