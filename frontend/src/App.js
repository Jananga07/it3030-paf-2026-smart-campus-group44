import React from 'react';
import { Routes, Route } from "react-router-dom";

import Navbar from './M2/components/Navbar';
import Home from './Home/Home';
import BookingForm from './M2/pages/BookingForm';
import MyBookings from './M2/pages/MyBookings';
import AdminPanel from './M2/pages/AdminPanel';
import BookingDetails from './M2/pages/BookingDetails';
import BookingList from './M2/pages/BookingList';
import Analytics from './M2/pages/Analytics';
import CheckIn from './M2/pages/CheckIn';


function App() {
  return (
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
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/checkin/:id" element={<CheckIn />} />

      </Routes>
    </>
  );
}

export default App;
