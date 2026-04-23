import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Booking Management",
      desc: "View, approve, reject and manage all campus resource bookings.",
      icon: "📋",
      link: "/admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Hero */}
      <section className="text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-800 leading-tight"
        >
          Admin <span className="text-indigo-600">Dashboard</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 text-lg text-gray-500 max-w-xl mx-auto"
        >
          Manage and oversee all Smart Campus operations from one place.
        </motion.p>
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate(card.link)}
            className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50 hover:shadow-lg transition duration-200 cursor-pointer"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-lg font-bold text-indigo-600 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-white border-t border-gray-200 text-sm text-gray-400">
        © 2026 Smart Campus System | SLIIT
      </footer>
    </div>
  );
}
