import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/bookings', label: 'All Bookings' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/book', label: 'New Booking' },
  { to: '/admin-dashboard', label: '🛠 Admin' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-indigo-600 tracking-tight">
          🏫 Smart Campus
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium pb-0.5 border-b-2 transition-colors duration-200 ${
                pathname === l.to
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-indigo-600'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-gray-500 hover:text-indigo-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === l.to ? 'text-indigo-600' : 'text-gray-500'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
