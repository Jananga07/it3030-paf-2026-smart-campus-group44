import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveToken } from "./authService";
import { useAuth } from "./useAuth";
import "./LoginPage.css";

const GOOGLE_URL = "http://localhost:8080/oauth2/authorization/google";
const ADMIN_EMAIL = "admin@gmail.com";

// ── Sign In form ──────────────────────────────────────────────────────────────
function SignInForm({ onAdminSuccess }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      // Call the real backend login endpoint
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If not admin credentials, show info message
        if (email !== ADMIN_EMAIL) {
          setInfo("Please use the 'Continue with Google' button to sign in.");
        } else {
          setError(data.error || "Login failed.");
        }
        setLoading(false);
        return;
      }

      // Success — save token and redirect
      saveToken(data.token);
      onAdminSuccess(data.user);
    } catch (err) {
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
          onChange={(e) => { setEmail(e.target.value); setInfo(""); setError(""); }}
          placeholder="you@example.com" />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input type="password" required value={password}
          onChange={(e) => { setPassword(e.target.value); setInfo(""); setError(""); }}
          placeholder="••••••••" />
      </div>
      {error && <div className="auth-error">{error}</div>}
      {info  && <div className="auth-info">{info}</div>}
      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, logout } = useAuth();
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
    if (loggedInUser.role === "ADMIN") {
      navigate("/admin-dashboard", { replace: true });
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
                <img src={user.pictureUrl} alt={user.name} className="auth-user-avatar" />
              )}
              <p className="auth-user-name">Welcome, <strong>{user.name}</strong>!</p>
              <p className="auth-user-email">{user.email}</p>
              <span className={`auth-user-role ${user.role === "ADMIN" ? "admin" : "user"}`}>
                {user.role}
              </span>
              <button className="auth-submit-btn"
                onClick={() => navigate(user.role === "ADMIN" ? "/admin-dashboard" : "/")}>
                Go to Home →
              </button>
              <button className="auth-logout-btn" onClick={async () => { await logout(); }}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <p className="login-card-sub">
                Sign in with Google or use admin credentials.
              </p>

              {oauthError && (
                <div className="auth-error" style={{ marginBottom: 12 }}>{oauthError}</div>
              )}

              {/* Google button */}
              <button className="login-google-btn"
                onClick={() => { window.location.href = GOOGLE_URL; }}>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google" className="login-google-icon" />
                Continue with Google
              </button>

              <div className="auth-divider"><span>or admin login</span></div>

              <SignInForm onAdminSuccess={handleSuccess} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
