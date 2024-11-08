import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import DutyPage from "./components/DutyPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleItemSelection = (item) => {
    setSelectedItem(item);
    setIsSidebarOpen(false);
  };

  const handleHomeClick = () => {
    setSelectedItem(null); // Redirect to HomePage
    setIsSidebarOpen(false); // Close sidebar
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 transition-opacity duration-300 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 mt-20 md:mt-24">
        {selectedItem && (
          <div className="p-4 text-center text-black">
            <h1 className="text-4xl font-semibold">{selectedItem}</h1>
            <h3 className="text-2xl font-semibold">ON DUTY</h3>
          </div>
        )}

        {selectedItem === null ? (
          <HomePage toggleSidebar={toggleSidebar} />
        ) : (
          <div className="pt-16">
            <DutyPage selectedCourse={selectedItem} />
          </div>
        )}
      </div>

      {isSidebarOpen && (
        <Sidebar
          ref={sidebarRef}
          closeSidebar={() => setIsSidebarOpen(false)}
          handleItemSelection={handleItemSelection}
          handleHomeClick={handleHomeClick} // Pass handleHomeClick to Sidebar
        />
      )}
    </div>
  );
}

export default App;
