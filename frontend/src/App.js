import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Shared layout
import Navbar from './M2/components/Navbar';

// Module 1 – Resources
import Home from './Home/Home';
import ResourceCatalogue from './M1/pages/ResourceCatalogue';
import ResourceDetails from './M1/pages/ResourceDetails';

// Module 2 – Bookings
import BookingForm from './M2/pages/BookingForm';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';
import BookingDetails from './M2/pages/BookingDetails';
import BookingList from './M2/pages/BookingList';
import Analytics from './M2/pages/Analytics';
import CheckIn from './M2/pages/CheckIn';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminResourceList from './AdminDashboard/AdminResourceList';

// Module 4 – Notifications
import NotificationsPage from './M4/NotificationsPage';

// Module 5 – Authentication & Authorization
import AuthCallback   from './M5/AuthCallback';
import LoginPage      from './M5/LoginPage';
import AdminLoginPage from './M5/AdminLoginPage';
import AdminPage      from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

// Pages that should NOT show the Navbar
const NO_NAVBAR_ROUTES = ["/login", "/admin-login", "/auth/callback", "/admin-dashboard", "/admin", "/admin/resources", "/analytics"];

function App() {
  const { pathname } = useLocation();
  const showNavbar = !NO_NAVBAR_ROUTES.includes(pathname);
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/admin-login"   element={<AdminLoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Module 1 – Resources */}
        <Route path="/resources"       element={<ResourceCatalogue />} />
        <Route path="/resources/:id"   element={<ResourceDetails />} />
        <Route path="/admin/resources" element={<AdminResourceList />} />

        {/* Module 2 – Bookings */}
        <Route path="/bookings"        element={<BookingList />} />
        <Route path="/book"            element={<BookingForm />} />
        <Route path="/my-bookings"     element={<MyBookings />} />
        <Route path="/bookings/:id"    element={<BookingDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/analytics"       element={<Analytics />} />
        <Route path="/checkin/:id"     element={<CheckIn />} />

        {/* Module 2 – Admin panel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Module 4 – Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Module 5 – Auth admin panel (ADMIN role only) */}
        <Route
          path="/admin/auth"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
