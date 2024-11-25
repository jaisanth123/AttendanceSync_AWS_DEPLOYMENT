import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        className="h-12 px-6 py-2 m-4 text-white transition bg-gray-800 rounded-lg lg:w-1/4 sm:w-1/2 hover:bg-gray-600 hover:text-xl" 
        onClick={() => navigate("/message")}
      >
        Generate Message
      </button>
      <button
        className="h-12 px-6 py-2 m-4 text-white transition bg-gray-800 rounded-lg lg:w-1/4 sm:w-1/2 hover:bg-gray-600 hover:text-xl"
        onClick={() => navigate("/generate_excel")}
      >
        Generate Excel
      </button>
      <button
        className="h-12 px-6 py-2 m-4 text-white transition bg-gray-800 rounded-lg lg:w-1/4 sm:w-1/2 hover:bg-gray-600 hover:text-xl"
        onClick={() => navigate("/send_mail")}
      >
        Send Email
      </button>
    </div>
  );
}

export default DashboardPage;
