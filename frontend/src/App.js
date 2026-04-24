import React from 'react';
import { Routes, Route } from "react-router-dom";

<<<<<<< HEAD
// Shared layout
import Navbar from './M2/components/Navbar';
=======
import Navbar from './M2/components/Navbar';
import Home from './Home/Home';
import ResourceCatalogue from './M1/pages/ResourceCatalogue';
import ResourceDetails from './M1/pages/ResourceDetails';

import BookingForm from './M2/pages/BookingForm';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';
import BookingDetails from './M2/pages/BookingDetails';
import BookingList from './M2/pages/BookingList';
import Analytics from './M2/pages/Analytics';
import CheckIn from './M2/pages/CheckIn';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminResourceList from './AdminDashboard/AdminResourceList';
>>>>>>> origin/Development-

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
import AdminPage      from './M5/AdminPage';
import ProtectedRoute from './M5/ProtectedRoute';

function App() {
  return (
<<<<<<< HEAD
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

        {/* Module 4 – Notifications */}
        <Route path="/notifications"   element={<NotificationsPage />} />

        {/* Module 2 admin (existing) */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Module 5 – Admin panel (ADMIN role only) */}
        <Route
          path="/admin/auth"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
=======
    
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<BookingList/>} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/checkin/:id" element={<CheckIn />} />
        <Route path="/resources" element={<ResourceCatalogue />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
        <Route path="/admin/resources" element={<AdminResourceList />} />

>>>>>>> origin/Development-
      </Routes>
    </>
  );
}

export default App;
