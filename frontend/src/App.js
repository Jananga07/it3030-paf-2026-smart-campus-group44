import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from './M5/AuthContext';

// Shared layout
import Navbar from './M2/components/Navbar';

// Home
import Home from './Home/Home';

// Module 1 – Resources
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

// Admin Dashboard
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminResourceList from './AdminDashboard/AdminResourceList';

// Module 3 – Tickets
import TicketDashboard from './M3/pages/TicketDashboard';
import CreateTicket from './M3/pages/CreateTicket';
import TicketDetails from './M3/pages/TicketDetails';
import AdminCategory from './M3/pages/AdminCategory';

// Module 4 – Notifications
import NotificationsPage from './M4/NotificationsPage';

// Module 5 – Auth
import LoginPage from './M5/LoginPage';
import AuthCallback from './M5/AuthCallback';
import AdminPage from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

// Pages that should NOT show the Navbar
const NO_NAVBAR_ROUTES = [
  "/login", "/auth/callback",
  "/admin-dashboard", "/admin", "/admin/resources",
  "/analytics", "/admin/auth", "/admin/ticket-categories",
];

function AppRoutes() {
  const { pathname } = useLocation();
  const showNavbar = !NO_NAVBAR_ROUTES.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<LoginPage />} />
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
        <Route path="/admin"           element={<AdminPanel />} />

        {/* Module 3 – Tickets */}
        <Route path="/tickets"                 element={<TicketDashboard />} />
        <Route path="/tickets/create"          element={<CreateTicket />} />
        <Route path="/tickets/:id"             element={<TicketDetails />} />
        <Route path="/admin/ticket-categories" element={<AdminCategory />} />
        <Route path="/m3/*"                    element={<Navigate to="/tickets" replace />} />

        {/* Module 4 – Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Module 5 – Auth admin panel (ADMIN only) */}
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

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
