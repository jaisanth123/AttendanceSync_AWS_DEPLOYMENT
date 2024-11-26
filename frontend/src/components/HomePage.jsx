import React from "react";
import { useNavigate } from "react-router-dom";

// Reusable Card Component
const ActionCard = ({ label, onClick }) => (
  <div
    className="flex flex-col items-center justify-center h-64 p-6 transition-all duration-300 transform bg-gray-800 shadow-2xl cursor-pointer w-full max-w-[14rem] sm:max-w-[12rem] rounded-xl hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:scale-95"
    aria-label={`${label} card`}
    onClick={onClick}
  >
    <h3 className="text-2xl font-bold text-center text-white">{label}</h3>
  </div>
);

function HomePage({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full pt-10">
      <div className="grid w-full max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {/* Attendance Card */}
        <ActionCard label="MARK ATTENDANCE" onClick={toggleSidebar} />

        {/* View Attendance Card */}
        <ActionCard
          label="VIEW ATTENDANCE"
          onClick={() => navigate("/dashboard")}
        />

        {/* Dashboard Card */}
        <ActionCard
          label="DASHBOARD"
          onClick={() => navigate("/dashboard")}
        />

        {/* Sign-in Card */}
        <ActionCard
          label="SIGNIN"
          onClick={() => navigate("/signin")}
        />
      </div>
    </div>
  );
}

export default HomePage;
