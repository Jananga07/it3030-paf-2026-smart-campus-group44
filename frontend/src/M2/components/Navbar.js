import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../../M4/NotificationBell';
// Module 5 – auth state for conditional nav
import { useAuth } from '../../M5/useAuth';

function Navbar() {
  const [open, setOpen]  = useState(false);
  const { pathname }     = useLocation();
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  // Links visible only when logged in
  const userLinks = [
    { to: '/resources',      label: 'Resources' },
    { to: '/bookings',       label: 'All Bookings' },
    { to: '/my-bookings',    label: 'My Bookings' },
    { to: '/book',           label: 'New Booking' },
    { to: '/tickets',        label: '🎫 Tickets' },
    { to: '/tickets/create', label: '+ Add Ticket' },
  ];

  // Admin-only link
  const adminLink = { to: '/admin-dashboard', label: '🛠 Admin' };

  const linkClass = (to) =>
    `text-sm font-medium pb-0.5 border-b-2 transition-colors duration-200 ${
      pathname === to
        ? 'text-indigo-600 border-indigo-600'
        : 'text-gray-500 border-transparent hover:text-indigo-600'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">
          🏫 Smart Campus
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Home always visible */}
          <Link to="/" className={linkClass('/')}>Home</Link>

          {/* Show these only when logged in */}
          {user && userLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              {l.label}
            </Link>
          ))}

          {/* Admin link — only for ADMIN role */}
          {user && user.role === 'ADMIN' && (
            <Link to={adminLink.to} className={linkClass(adminLink.to)}>
              {adminLink.label}
            </Link>
          )}

          {/* Module 4 – Notification Bell (logged in only) */}
          {user && <NotificationBell userId={user.id} />}

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">👋 {user.name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-indigo-600 border border-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/admin/auth')}
                className="text-sm font-medium text-gray-600 border border-gray-400 px-3 py-1 rounded-lg hover:bg-gray-600 hover:text-white transition duration-200"
              >
                Get Start
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-500 hover:text-indigo-600"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setOpen(false)}
            className={`text-sm font-medium ${pathname === '/' ? 'text-indigo-600' : 'text-gray-500'}`}>
            Home
          </Link>

          {user && userLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === l.to ? 'text-indigo-600' : 'text-gray-500'}`}>
              {l.label}
            </Link>
          ))}

          {user && user.role === 'ADMIN' && (
            <Link to={adminLink.to} onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === adminLink.to ? 'text-indigo-600' : 'text-gray-500'}`}>
              {adminLink.label}
            </Link>
          )}

          {user ? (
            <>
              <span className="text-sm text-gray-600">👋 {user.name}</span>
              <button onClick={() => { logout(); setOpen(false); }}
                className="text-sm font-medium text-red-500 text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setOpen(false); }}
                className="text-sm font-medium text-indigo-600 text-left">
                User Login
              </button>
              <button onClick={() => { navigate('/admin-login'); setOpen(false); }}
                className="text-sm font-medium text-gray-600 text-left">
                Admin Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
