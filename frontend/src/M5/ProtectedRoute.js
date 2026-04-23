import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

/**
 * Module 5 – ProtectedRoute
 *
 * Mirrors Module 4's pattern: a single reusable wrapper component.
 *
 * Usage:
 *   <ProtectedRoute>               – any authenticated user
 *   <ProtectedRoute role="ADMIN">  – ADMIN role only
 *
 * Unauthenticated users → redirected to /login
 * Wrong role            → redirected to / with a forbidden state flag
 */
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center",
        alignItems: "center", height: "100vh",
        fontFamily: "Segoe UI, sans-serif", color: "#4f46e5",
      }}>
        <p>Loading…</p>
      </div>
    );
  }

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → go home with forbidden flag
  if (role && user.role !== role) {
    return <Navigate to="/" replace state={{ forbidden: true }} />;
  }

  return children;
}
