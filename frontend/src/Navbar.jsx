import React from "react";

function Navbar({ toggleSidebar }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // Get today's date

  return (
    <nav className="flex items-center justify-between h-20 px-4 py-2 text-white bg-gray-800 shadow-md ">
      {/* Menu icon to toggle the sidebar */}
      <button
        onClick={toggleSidebar} // Trigger sidebar toggle when clicked
        className="text-xl" // Show only on mobile (md:hidden hides it on larger screens)
      >
        &#9776; {/* Hamburger menu icon */}
      </button>

      {/* App Name/Title */}
      <span className="ml-32 text-lg font-semibold">
        ATTENDANCE AI DEPARTMENT
      </span>

      {/* Display Today's Date */}
      <span>{today}</span>
    </nav>
  );
}

export default Navbar;
