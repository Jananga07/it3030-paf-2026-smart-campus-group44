import React from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const features = [
    {
      title: "Resource Booking",
      desc: "Easily book lecture halls, labs, and equipment with real-time availability.",
      icon: "📅",
    },
    {
      title: "Incident Reporting",
      desc: "Report issues with images and track resolution progress efficiently.",
      icon: "🛠️",
    },
    {
      title: "Smart Notifications",
      desc: "Get instant updates on bookings, tickets, and system activities.",
      icon: "🔔",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Hero */}
      <section className="text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-800 leading-tight"
        >
          Smart Campus <span className="text-indigo-600">Operations Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 text-lg text-gray-500 max-w-xl mx-auto"
        >
          Manage facilities, book resources, report incidents, and stay updated
          with a modern campus management system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md">
            Explore Features
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold px-6 py-3 rounded-xl transition duration-200">
            Login with Google
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-2xl shadow-md p-7 border border-indigo-50 hover:shadow-lg transition duration-200"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold text-indigo-600 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
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
