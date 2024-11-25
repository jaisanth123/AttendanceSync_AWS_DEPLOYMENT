import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import DutyPage from "./components/DutyPage";
import Absentees from "./components/Absentees"; // Import Absentees component
import MessagePage from "./components/MessagePage";
import DashboardPage from "./components/DashboardPage";
import GenerateExcel from "./components/GenerateExcel";
import SendMail from "./components/SendMail";
import DashMessage from "./components/DashMessage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";


import AbsentReportDownloader from './components/AbsentReportDownloader'; // Adjust the path as needed
import DownloadReport from './components/DownloadReport'; // Adjust the path as needed

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const sidebarRef = useRef(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Handle item selection in the sidebar
  const handleItemSelection = (item) => {
    setSelectedItem(item);
    setIsSidebarOpen(false);
  };

  // Toggle between SignIn and SignUp views
  const toggleMode = () => {
    setIsSigningIn(!isSigningIn);
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
    let isMounted = true; // Flag to check if component is mounted

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMounted) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      isMounted = false; // Set flag to false when the component unmounts
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generate_excel" element={<GenerateExcel />} />
            <Route path="/send_mail" element={<SendMail />} />
            <Route path="/dashmessage" element={<DashMessage />} />

            {/* Authentication Pages */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/absent-report" element={<AbsentReportDownloader />} />
            <Route path="/downloadReport" element={<DownloadReport />} />


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