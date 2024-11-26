import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import DutyPage from "./components/DutyPage";
import Absentees from "./components/Absentees";
import MessagePage from "./components/MessagePage";
import ViewAttendance from "./components/ViewAttendance";
import GenerateMessage from "./components/GenerateMessage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import GenerateExcel from './components/GenerateExcel';
import GenerateReport from './components/GenerateReport';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const sidebarRef = useRef(null);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Handle item selection in the sidebar
  const handleItemSelection = (item) => {
    setSelectedItem(item);
    setIsSidebarOpen(false);
  };

  // Handle home button click
  const handleHomeClick = () => {
    if (window.location.pathname !== '/absentees') {
      setSelectedItem(null); // Reset selectedItem only if not on /absentees
    }
    setIsSidebarOpen(false);
  };

  // Close sidebar if clicked outside
  useEffect(() => {
    let isMounted = true;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMounted) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      isMounted = false;
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar Component */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 transition-opacity duration-300 bg-black opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          ></div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 mt-20 md:mt-24">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={<HomePage toggleSidebar={toggleSidebar} />}
            />

            {/* Duty Page */}
            <Route
              path="/duty"
              element={<DutyPage selectedCourse={selectedItem} />}
            />

            {/* Absentees Page */}
            <Route
              path="/absentees"
              element={<Absentees selectedCourse={selectedItem} />}
            />

            {/* Message Page */}
            <Route
              path="/message"
              element={
                <MessagePage
                  selectedCourse={selectedItem}
                  toggleSidebar={toggleSidebar}
                />
              }
            />

            {/* Dashboard and Utility Pages */}
            <Route
              path="/viewattendance"
              element={<ViewAttendance />} // Removed toggleSidebar here
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/GenerateMessage" element={<GenerateMessage toggleSidebar={toggleSidebar} />} /> {/* Pass toggleSidebar here */}

            {/* Authentication Pages */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/generateEmail" element={<GenerateExcel />} />
            <Route path="/generateReport" element={<GenerateReport />} />
          </Routes>
        </div>

        {/* Sidebar Component */}
        {isSidebarOpen && (
          <Sidebar
            ref={sidebarRef}
            closeSidebar={() => setIsSidebarOpen(false)}
            handleItemSelection={handleItemSelection}
            handleHomeClick={handleHomeClick}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
