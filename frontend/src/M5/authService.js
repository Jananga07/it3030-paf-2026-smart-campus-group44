/**
 * Module 5 – Auth Service
 *
 * Handles JWT storage, retrieval, and the /api/auth/me call.
 * All other modules can import { getAuthHeader } to attach the token.
 */

const TOKEN_KEY = "sc_token";

/** Store the JWT in localStorage after OAuth callback. */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Retrieve the stored JWT (or null). */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Remove the JWT (logout). */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Returns an Authorization header object ready to spread into fetch options.
 * Usage:  fetch(url, { headers: { ...getAuthHeader() } })
 */
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Fetch the current user's profile from the backend. */
export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch("http://localhost:8080/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    removeToken(); // token expired or invalid
    return null;
  }

  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

/** Notify the backend of logout (fire-and-forget), then clear local token. */
export async function logout() {
  const token = getToken();
  if (token) {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {}); // ignore network errors on logout
  }
  removeToken();
}
