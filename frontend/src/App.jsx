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

      {/* Sidebar background overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 transition-opacity duration-300 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 mt-20 md:mt-24"> {/* Added margin-top here */}
        {/* Display selected item title when selected */}
        {selectedItem && (
          <div className="p-4 text-center text-black">
            <h1 className="text-4xl font-semibold">{selectedItem}</h1>
            <h3 className="text-2xl font-semibold">ON DUTY</h3>
          </div>
        )}

        {/* Conditional rendering of HomePage or DutyPage */}
        {selectedItem === null ? (
          <HomePage toggleSidebar={toggleSidebar} />
        ) : (
          <div className="pt-16">
            {/* Add padding-top for content below navbar */}
            <DutyPage selectedCourse={selectedItem} />
          </div>
        )}
      </div>

      {/* Sidebar component */}
      {isSidebarOpen && (
        <Sidebar
          ref={sidebarRef} // Pass the ref to Sidebar
          closeSidebar={() => setIsSidebarOpen(false)}
          handleItemSelection={handleItemSelection}
        />
      )}
    </div>
  );
}

export default App;
