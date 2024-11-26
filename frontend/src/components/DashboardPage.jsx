import React from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
=======
// Reusable Card Component
const ActionCard = ({ label, onClick }) => (
  <div
  className="flex flex-col items-center justify-center h-64 p-6 transition-all duration-300 transform bg-gray-800 shadow-2xl cursor-pointer w-full sm:max-w-[10rem] md:max-w-[12rem] lg:max-w-[14rem] rounded-xl hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:scale-95"
  aria-label={`${label} card`}
    onClick={onClick}
  >
    <h3 className="text-3xl font-bold text-center text-white">{label}</h3>
  </div>
);

>>>>>>> d94b84d42949f44dd56763c7eacb743b2a852927
function DashboardPage({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center justify-center h-full">
      <button
        className="h-12 px-6 py-2 m-4 text-xl text-white transition bg-gray-800 rounded-lg hover:scale-110 lg:w-1/4 sm:w-1/2 hover:bg-gray-600" 
        onClick={() => {
            // Toggle the sidebar when button is clicked
          navigate("/dashmessage");  // Navigate to DashMessage page
        }}
      >
        Generate Message
      </button>
      <button
        className="h-12 px-6 py-2 m-4 text-xl text-white transition bg-gray-800 rounded-lg hover:scale-110 lg:w-1/4 sm:w-1/2 hover:bg-gray-600"
        onClick={() => navigate("/absent-report")}
      >
        Generate Excel
      </button>
      <button
        className="h-12 px-6 py-2 m-4 text-xl text-white transition bg-gray-800 rounded-lg hover:scale-110 lg:w-1/4 sm:w-1/2 hover:bg-gray-600"
        onClick={() => navigate("/send_mail")}
      >
        Send Email
      </button>
      <button
        className="h-12 px-6 py-2 m-4 text-xl text-white transition bg-gray-800 rounded-lg hover:scale-110 lg:w-1/4 sm:w-1/2 hover:bg-gray-600"
        onClick={() => navigate("/downloadReport")}
      >
        Report
      </button>
=======
    <div className="flex items-center justify-center h-full pt-10">
      <div className="grid w-full max-w-5xl grid-cols-2 gap-6 px-1 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {/* Generate Message Card */}
        <ActionCard
          label="Generate Message"
          onClick={() => navigate("/dashmessage")}
        />

        {/* Generate Excel Card */}
        <ActionCard
          label="Generate Excel"
          onClick={() => navigate("/absent-report")}
        />

        {/* Send Email Card */}
        <ActionCard
          label="Send Email"
          onClick={() => navigate("/send_mail")}
        />

        {/* Report Card */}
        <ActionCard
          label="Report"
          onClick={() => navigate("/downloadReport")}
        />
      </div>
>>>>>>> d94b84d42949f44dd56763c7eacb743b2a852927
    </div>
  );
}

export default DashboardPage;
