/**
 * Module 5 – useAuth hook
 * Re-exports useAuth from AuthContext as a standalone file.
 *
 * Usage:
 *   import { useAuth } from "../M5/useAuth";
 *   const { user, loading, logout } = useAuth();
 */
import { useAuth } from "./AuthContext";

export { useAuth };
