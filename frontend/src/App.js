import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from './Home/Home';
// Module 4 – Notifications (Member 4)
import NotificationsPage from './M4/NotificationsPage';
// Module 5 – Authentication & Authorization (Member 5)
import AuthCallback   from './M5/AuthCallback';
import LoginPage      from './M5/LoginPage';
import AdminPage      from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"              element={<Home />} />
      <Route path="/login"         element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Module 4 – Notifications (authenticated users only) */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Module 5 – Admin panel (ADMIN role only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
