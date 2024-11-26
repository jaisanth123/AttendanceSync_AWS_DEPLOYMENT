import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Reusable Button Component
const ActionButton = ({ label, onClick }) => (
  <button
    className="px-6 py-3 font-bold text-white transition-all duration-300 transform bg-gray-800 rounded-lg shadow-lg w-80 hover:bg-gray-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95"
    aria-label={`${label} button`} // Fixed interpolation for aria-label
    onClick={onClick}
  >
    {label}
  </button>
);

function HomePage({ toggleSidebar }) {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      {/* Attendance Button */}
      <ActionButton label="MARK ATTENDANCE" onClick={toggleSidebar} />

      {/* View Attendance Button */}
      <ActionButton
        label="VIEW ATTENDANCE"
        onClick={() => navigate("/dashboard")} // Navigate to /dashboard
      />
      <ActionButton
        label="DASHBOARD"
        onClick={() => navigate("/dashboard")} // Navigate to /dashboard
      />

<ActionButton
        label="SIGNIN"
        onClick={() => navigate("/signin")} // Navigate to /dashboard
      />



    </div>
  );
}

export default HomePage;
