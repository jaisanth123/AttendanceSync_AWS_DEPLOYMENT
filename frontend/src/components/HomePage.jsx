import React from "react";

// Reusable Button Component
const ActionButton = ({ label, onClick }) => (
  <button
    className="px-6 py-3 font-bold text-white transition-all duration-300 transform bg-gray-600 rounded-lg shadow-lg w-80 hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95"
    aria-label={`${label} button`}
    onClick={onClick}
  >
    {label}
  </button>
);

function HomePage({ toggleSidebar }) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      {/* Attendance Button */}
      <ActionButton label="ATTENDANCE" onClick={toggleSidebar} />

      {/* Use Dashboard Button */}
      <ActionButton label="USE DASHBOARD" onClick={() => alert("Dashboard coming soon!")} />
    </div>
  );
}

export default HomePage;
