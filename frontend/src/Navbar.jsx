import React from "react";

function Navbar({ toggleSidebar }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Get today's date

  return (
    <nav className="relative flex items-center justify-between h-20 px-4 py-2 text-white bg-gray-800 shadow-md">
      {/* Menu icon to toggle the sidebar */}
      <button
        onClick={toggleSidebar} // Trigger sidebar toggle when clicked
        className="text-xl"
      >
        &#9776; {/* Hamburger menu icon */}
      </button>

      {/* Centered Title and Date - Responsive Layout */}
      <div className="absolute left-0 right-0 flex flex-col items-center text-center">
        <span className="w-48 text-lg font-semibold whitespace-normal sm:w-auto">
          ATTENDANCE AI DEPARTMENT
        </span>
        <span className="text-sm sm:hidden">{today}</span> {/* Show date below title on small screens */}
      </div>

      {/* Display Today's Date - For Larger Screens */}
      <span className="hidden sm:inline">{today}</span>
    </nav>
  );
}

export default Navbar;
