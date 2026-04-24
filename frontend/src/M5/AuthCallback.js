import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, fetchCurrentUser } from "./authService";
import { useAuth } from "./AuthContext";

/**
 * Module 5 – Auth Callback page.
 * Route: /auth/callback
 *
 * After Google OAuth login the backend redirects here with:
 *   /auth/callback?token=<JWT>
 *
 * Reads token → saves → fetches profile → sets context → redirects to home.
 */
export default function AuthCallback() {
  const navigate    = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");

    // OAuth failed — go back to login with error
    if (error || !token) {
      navigate("/login?error=" + (error || "no_token"), { replace: true });
      return;
    }

    saveToken(token);

    fetchCurrentUser()
      .then((user) => {
        setUser(user);
        navigate("/", { replace: true }); // ← go to home after Google login
      })
      .catch(() => {
        navigate("/login?error=profile_fetch_failed", { replace: true });
      });
  }, [navigate, setUser]);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      height: "100vh", fontFamily: "Segoe UI, sans-serif",
      background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)",
      color: "#4f46e5",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
      <p style={{ fontSize: 18, fontWeight: 600 }}>Signing you in…</p>
    </div>
  );
}
