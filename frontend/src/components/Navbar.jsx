import React from "react";

function Navbar({ toggleSidebar }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-md">
      {/* For large screens */}
      <div className="items-center justify-between hidden px-4 py-4 text-white sm:flex sm:py-6">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-xl sm:text-2xl"
        >
          &#9776;
        </button>

        {/* Title (centered for large screens, stay in one line) */}
        <div className="flex-1 ml-48 overflow-hidden text-xl font-semibold text-center whitespace-nowrap">
          ATTENDANCE AI DEPARTMENT
        </div>

        {/* Date (on large screens, moves below if there's not enough space) */}
        <div className="hidden text-lg sm:block lg:text-xl sm:mt-2">
          {today}
        </div>
      </div>

      {/* For small screens (mobile): menu icon and title on the same row, date below */}
      <div className="px-4 py-2 text-white sm:hidden">
        {/* Menu icon and title in one row */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="text-xl sm:text-2xl"
          >
            &#9776;
          </button>
          <div className="w-full text-lg font-semibold text-center">
            ATTENDANCE AI DEPARTMENT
          </div>
        </div>

        {/* Date in a separate row below */}
        <div className="mt-2 text-sm text-center">
          {today}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
