import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveToken } from "./authService";
import { useAuth } from "./useAuth";
import "./LoginPage.css";

/**
 * LoginPage – Module 5 (Member 5)
 * Route: /login
 */

const API        = "http://localhost:8080/api/auth";
const GOOGLE_URL = "http://localhost:8080/oauth2/authorization/google";

// ── Sign In form ──────────────────────────────────────────────────────────────
function SignInForm({ onSuccess }) {
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
      saveToken(data.token);
      onSuccess(data.user);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Email</label>
        <input type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" />
      </div>
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      saveToken(data.token);
      onSuccess(data.user);
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
          placeholder="John Smith" />
      </div>
      <div className="auth-field">
        <label>Email</label>
        <input type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" />
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
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const { user, setUser, logout } = useAuth();
  const [tab, setTab]  = useState("signin");
  const [oauthError, setOauthError] = useState("");

  // Show error if redirected back from failed OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err    = params.get("error");
    if (err) {
      setOauthError(
        err === "oauth_failed"
          ? "Google sign-in failed. Please try again."
          : "Authentication error. Please try again."
      );
    }
  }, [location.search]);

  const handleSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    // ADMIN users go to admin panel, USER users go to home
    if (loggedInUser.role === "ADMIN") {
      navigate("/admin/auth", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <div className="login-page-header">
        <button className="login-page-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="login-page-title">🔐 Account</h1>
      </div>

      <div className="login-page-content">
        <div className="login-card">
          <div className="login-card-icon">🎓</div>
          <h2 className="login-card-heading">Smart Campus</h2>

          {/* ── Logged-in state ── */}
          {user ? (
            <div className="auth-logged-in">
              {user.pictureUrl && (
                <img src={user.pictureUrl} alt={user.name}
                  className="auth-user-avatar" />
              )}
              <p className="auth-user-name">Welcome, <strong>{user.name}</strong>!</p>
              <p className="auth-user-email">{user.email}</p>
              <span className={`auth-user-role ${user.role === "ADMIN" ? "admin" : "user"}`}>
                {user.role}
              </span>
              <button className="auth-submit-btn" onClick={() => navigate("/")}>
                Go to Home →
              </button>
              <button className="auth-logout-btn" onClick={async () => { await logout(); }}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <p className="login-card-sub">
                Sign in or create an account to access campus services.
              </p>

              {/* OAuth error banner */}
              {oauthError && (
                <div className="auth-error" style={{ marginBottom: 12 }}>
                  {oauthError}
                </div>
              )}

              {/* Tabs */}
              <div className="auth-tabs">
                <button className={`auth-tab${tab === "signin" ? " active" : ""}`}
                  onClick={() => setTab("signin")}>Sign In</button>
                <button className={`auth-tab${tab === "register" ? " active" : ""}`}
                  onClick={() => setTab("register")}>Register</button>
              </div>

              {/* Google button */}
              <button className="login-google-btn"
                onClick={() => { window.location.href = GOOGLE_URL; }}>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google" className="login-google-icon" />
                Continue with Google
              </button>

              <div className="auth-divider"><span>or use email</span></div>

              {/* Form */}
              {tab === "signin"
                ? <SignInForm onSuccess={handleSuccess} />
                : <RegisterForm onSuccess={handleSuccess} />
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}
