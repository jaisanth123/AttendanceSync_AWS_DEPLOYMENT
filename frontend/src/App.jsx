import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DutyPage from "./DutyPage"; // Import the new DutyPage component
import HomePage from "./HomePage"; // Import the HomePage component

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Initially, no course is selected

  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null); // Reference to the main content

  // Close sidebar if click is outside of sidebar or main content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && !sidebarRef.current.contains(event.target) && 
        mainContentRef.current && !mainContentRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false); // Close sidebar when clicked outside
      }
    };

    // Add event listener for clicks
    document.addEventListener("click", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Prevent click event propagation inside the sidebar
  const handleSidebarClick = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the document
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemSelection = (item) => {
    setSelectedItem(item); // Update selected item when a dropdown element is clicked
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Overlay for sidebar on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 transition-opacity duration-300 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div ref={mainContentRef} className="flex-1">
        {/* Show the course name and status if a course is selected */}
        {selectedItem && (
          <div className="p-4 text-center text-black">
            <h1 className="text-4xl font-semibold">{selectedItem}</h1>
            <h3 className="text-2xl font-semibold">ON DUTY</h3>
          </div>
        )}

        {selectedItem === null ? (
          // Show HomePage if no course is selected
          <HomePage toggleSidebar={toggleSidebar} />
        ) : (
          // Show DutyPage when a course is selected
          <DutyPage selectedItem={selectedItem} />
        )}
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidebar
          ref={sidebarRef}
          closeSidebar={() => setIsSidebarOpen(false)}
          handleSidebarClick={handleSidebarClick}
          handleItemSelection={handleItemSelection} // Pass the selection handler
        />
      )}
    </div>
  );
}

export default App;
