import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './Home/Home';

// Module 3 Imports
import { AuthProvider } from './M3/api/AuthContext';
import TicketDashboard from './M3/pages/TicketDashboard';
import CreateTicket from './M3/pages/CreateTicket';
import TicketDetails from './M3/pages/TicketDetails';
import AdminCategory from './M3/pages/AdminCategory';

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
  );
}

export default App;