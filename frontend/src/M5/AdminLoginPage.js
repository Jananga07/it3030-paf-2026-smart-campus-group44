import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "./authService";
import { useAuth } from "./useAuth";
import "./LoginPage.css";

/**
 * AdminLoginPage – Module 5 (Member 5)
 * Route: /admin-login
 *
 * Admin-only login page.
 * - Email + password only (no Google, no register)
 * - On success: redirects to /admin/auth (ADMIN role required)
 * - Non-admin credentials show an error
 */

const API = "http://localhost:8080/api/auth";

export default function AdminLoginPage() {
  const navigate       = useNavigate();
  const { setUser }    = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
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

      // Only allow ADMIN role through this page
      if (data.user.role !== "ADMIN") {
        setError("Access denied. This login is for administrators only.");
        return;
      }

      saveToken(data.token);
      setUser(data.user);
      navigate("/admin/auth", { replace: true });
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
        <h1 className="login-page-title">🛡️ Admin Login</h1>
      </div>

      <div className="login-page-content">
        <div className="login-card">
          <div className="login-card-icon">🔒</div>
          <h2 className="login-card-heading">Administrator Access</h2>
          <p className="login-card-sub">
            This area is restricted to system administrators only.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Admin Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In as Admin"}
            </button>
          </form>

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
