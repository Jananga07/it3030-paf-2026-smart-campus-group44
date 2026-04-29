import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";

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
// Module 4 – Notifications page
import NotificationsPage from './M4/NotificationsPage';

// Module 4 – Notifications
import NotificationsPage from './M4/NotificationsPage';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>

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
// Module 4 – Notifications page
import NotificationsPage from './M4/NotificationsPage';

// Module 3 Imports
import { AuthProvider } from './M3/api/AuthContext';
import TicketDashboard from './M3/pages/TicketDashboard';
import CreateTicket from './M3/pages/CreateTicket';
import TicketDetails from './M3/pages/TicketDetails';
import AdminCategory from './M3/pages/AdminCategory';

// Module 5 – Authentication & Authorization
import AuthCallback   from './M5/AuthCallback';
import LoginPage      from './M5/LoginPage';
import AdminPage      from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar />
        <Routes>
          {/* Public routes */}
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

          {/* Module 2 – Admin panel */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Module 3 – Tickets */}
          <Route path="/tickets" element={<TicketDashboard/>}/>
          <Route path="/tickets/create" element={<CreateTicket/>}/>
          <Route path="/admin/ticket-categories" element={<AdminCategory/>}/>
          <Route path="/tickets/:id" element={<TicketDetails/>}/>
          
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
          
          {/* Redirect any stray traffic to dashboard */}
          <Route path="/m3/*" element={<Navigate to="/tickets" replace />} />
        </Routes>
      </>
    </AuthProvider>

// Module 3 Imports
import { AuthProvider } from './M3/api/AuthContext';
import TicketDashboard from './M3/pages/TicketDashboard';
import CreateTicket from './M3/pages/CreateTicket';
import TicketDetails from './M3/pages/TicketDetails';
import AdminCategory from './M3/pages/AdminCategory';
// Module 5 – Authentication & Authorization
import AuthCallback   from './M5/AuthCallback';
import LoginPage      from './M5/LoginPage';
import AdminPage      from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

// Pages that should NOT show the Navbar
const NO_NAVBAR_ROUTES = ["/login", "/admin-login", "/auth/callback", "/admin-dashboard", "/admin", "/admin/resources", "/analytics", "/admin/auth"];

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>}/>
        
        {/* Module 3 Routes */}
        <Route path="/m3" element={<TicketDashboard/>}/>
        <Route path="/m3/create" element={<CreateTicket/>}/>
        <Route path="/m3/admin/categories" element={<AdminCategory/>}/>
        <Route path="/m3/ticket/:id" element={<TicketDetails/>}/>
        
        {/* Redirect any stray traffic to dashboard */}
        <Route path="/m3/*" element={<Navigate to="/m3" replace />} />
      </Routes>
    </AuthProvider>

    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Module 1 – Resources */}
        <Route path="/resources"       element={<ResourceCatalogue />} />
        <Route path="/resources/:id"   element={<ResourceDetails />} />
        <Route path="/admin/resources" element={<AdminResourceList />} />
        {/* Module 4 – Notifications */}
        <Route path="/notifications" element={<NotificationsPage />} />

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
