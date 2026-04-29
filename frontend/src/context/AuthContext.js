import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("sc_isAdmin") === "true"
  );

  const loginAdmin = (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("sc_isAdmin", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.removeItem("sc_isAdmin");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
