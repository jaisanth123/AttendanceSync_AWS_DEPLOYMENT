import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();  // To navigate programmatically
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Logout handler function
  const logoutHandler = () => {
    // Remove the token from sessionStorage
    sessionStorage.removeItem("authToken");
    
    // Redirect to the login page
    navigate("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
      {/* For large screens */}
      <div className="items-center justify-between hidden px-4 py-4 text-white sm:flex sm:py-6">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-xl sm:text-2xl"
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>

        {/* Title centered for large screens */}
        <div className="flex-1 ml-40 text-xl font-semibold text-center whitespace-nowrap">
          ATTENDANCE AI DEPARTMENT
        </div>

        {/* Date */}
        <div className="text-lg sm:block lg:text-xl sm:mt-2">
          {today}
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* For small screens */}
      <div className="px-4 py-2 text-white sm:hidden">
        {/* Icon and Title in one row */}
        <div className="flex items-center">
          {/* Sidebar Toggle Icon (positioned in the middle of the left side) */}
          <button
            onClick={toggleSidebar}
            className="flex items-center h-10 mr-2 text-xl sm:text-2xl"
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>

          {/* Title centered in one line */}
          <div className="flex-grow text-lg font-semibold text-center">
            ATTENDANCE AI DEPARTMENT
          </div>
        </div>

        {/* Date on a separate row below */}
        <div className="mt-1 text-sm text-center">
          {today}
        </div>

        {/* Logout Button for small screens */}
        <button
          onClick={logoutHandler}
          className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
