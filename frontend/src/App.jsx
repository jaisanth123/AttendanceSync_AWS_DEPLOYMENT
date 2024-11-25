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
    if (window.location.pathname !== '/absentees') {
      setSelectedItem(null); // Reset selectedItem only if not on /absentees
    }
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
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar toggleSidebar={toggleSidebar} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 transition-opacity duration-300 bg-black opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

<div className="flex-1 mt-20 md:mt-24">
          <Routes>
            <Route
              path="/"
              element={<HomePage toggleSidebar={toggleSidebar} />}
            />
            <Route
              path="/duty"
              element={<DutyPage selectedCourse={selectedItem} />}
            />
            <Route
              path="/absentees"
              element={<Absentees selectedCourse={selectedItem} />}
            />
            <Route
              path="/message"
              element={
                <MessagePage
                  selectedCourse={selectedItem}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generate_excel" element={<GenerateExcel />} />
            <Route path="/send_mail" element={<SendMail />} />
            <Route path="/dashmessage" element={<DashMessage />} />
          </Routes>
        </div>


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