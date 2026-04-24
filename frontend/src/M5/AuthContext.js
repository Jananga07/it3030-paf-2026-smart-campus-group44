import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser, logout as doLogout } from "./authService";

/**
 * Module 5 – Auth Context
 *
 * Provides { user, loading, logout } to the whole app.
 *
 * user shape: { id, name, email, pictureUrl, role }  or  null when not logged in.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session from stored JWT
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await doLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook for consuming auth state in any component. */
export function useAuth() {
  return useContext(AuthContext);
}
