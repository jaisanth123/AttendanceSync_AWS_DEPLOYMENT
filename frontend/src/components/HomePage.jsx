import React from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Reusable Button Component
const ActionButton = ({ label, onClick }) => (
  <button
    className="px-6 py-3 font-bold text-white transition-all duration-300 transform bg-gray-600 rounded-lg shadow-lg w-80 hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 active:scale-95"
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



=======
import { useNavigate } from "react-router-dom";

// Reusable Card Component
const ActionCard = ({ label, onClick }) => (
  <div
  className="flex flex-col items-center justify-center h-64 p-6 transition-all duration-300 transform bg-gray-800 shadow-2xl cursor-pointer w-full sm:max-w-[10rem] md:max-w-[12rem] lg:max-w-[14rem] rounded-xl hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:scale-95"
    aria-label={`${label} card`}
    onClick={onClick}
  >
    <h3 className="text-3xl font-bold text-center text-white">{label}</h3>
  </div>
);

function HomePage({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full pt-10">
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 px-1 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {/* Attendance Card */}
        <ActionCard label="Mark Attendance" onClick={toggleSidebar} />

        {/* View Attendance Card */}
        <ActionCard
          label="View Attendance"
          onClick={() => navigate("/dashboard")}
        />

        {/* Dashboard Card */}
        <ActionCard
          label="Dashboard"
          onClick={() => navigate("/dashboard")}
        />

        {/* Sign-in Card */}
        <ActionCard
          label="Signin"
          onClick={() => navigate("/signin")}
        />
      </div>
>>>>>>> d94b84d42949f44dd56763c7eacb743b2a852927
    </div>
  );
}

export default HomePage;
