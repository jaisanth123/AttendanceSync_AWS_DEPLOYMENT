import React from "react";

function HomePage({ toggleSidebar }) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      {/* Attendance Button */}
      <button
        className="px-6 py-3 text-white transition-all duration-300 transform bg-gray-600 rounded-lg shadow-lg w-80 hover:bg-gray-700 hover:scale-105"
        aria-label="Attendance button"
        onClick={toggleSidebar} 
      >
        ATTENDANCE
      </button>

      {/* Use Dashboard Button */}
      <button
        className="px-6 py-3 text-white transition-all duration-300 transform bg-gray-600 rounded-lg shadow-lg w-80 hover:bg-gray-700 hover:scale-105"
        aria-label="Use Dashboard button"
      >
        USE DASHBOARD
      </button>
    </div>
  );
}

export default HomePage;
