import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // Import axios
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS

const GenerateReport = () => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [message, setMessage] = useState(""); // State to hold message when no students are absent
  const [date, setDate] = useState(""); // State to store selected date
  const [gender, setGender] = useState("ALL"); // State to store selected gender
  const [hostellerDayScholar, setHostellerDayScholar] = useState("ALL"); // Hosteller/Day Scholar selection
  const [yearOfStudy, setYearOfStudy] = useState("ALL"); // Selected year of study
  const [section, setSection] = useState("ALL"); // Selected section
  const [branch, setBranch] = useState("ALL"); // Selected branch
  const navigate = useNavigate();

  const handleDateChange = (e) => setDate(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleHostellerDayScholarChange = (e) =>
    setHostellerDayScholar(e.target.value);
  const handleYearOfStudyChange = (e) => setYearOfStudy(e.target.value);
  const handleSectionChange = (e) => setSection(e.target.value);
  const handleBranchChange = (e) => setBranch(e.target.value);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle the button click to download the report
  const handleDownload = () => {
    if (!date) {
      // Show toast message for missing date selection
      toast.info('Please select a date.', { autoClose: 800 });
      return;
    }

    setIsLoading(true);
    setMessage("");

    const url = `http://localhost:5000/api/report/download-absent-report?gender=${gender}&date=${date}&hostellerDayScholar=${hostellerDayScholar}&yearOfStudy=${yearOfStudy}&section=${section}&branch=${branch}`;

    // Using axios to handle the request
    axios
      .get(url, { responseType: "blob",
        withCredentials: true // Include credentials (cookies) with the request
       }) // Set the responseType to 'blob' for file downloads
      .then((response) => {
        if (response.status === 404) {
          const formattedDate = formatDate(date);
          setMessage(
            `No absent students found for specified criteria on ${formattedDate}.`
          );
          setIsLoading(false);
          toast.info(
            `No absent students found for specified criteria on ${formattedDate}.`,
            { autoClose: 800 }
          );
        } else if (response.status === 200) {
          const blob = response.data;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Absent_Students_Report.xlsx";
          link.click();
          setIsLoading(false);
          toast.success("Report downloaded successfully!", { autoClose: 800 });
        }
      })
      .catch((error) => {
        console.error("Error generating report:", error);
        if (error.response) {
          console.log("Error Response Data:", error.response.data);
        }
        
        // Check for specific error responses
        if (error.response && error.response.status === 403) {
          console.log("Error Response:", error.response); // Log the full error response to the console
          const errorMessage = error.response.data.message || "You are not authorized to access this page.";
          toast.error(`Error: ${errorMessage}`, {
          autoClose: 800,
          });
        }
         else {
          toast.error("An error occurred while generating the report.", {
            autoClose:800,
          });
        }
    
        setIsLoading(false);
      });
  };
  return (
<div className="flex items-start justify-center min-h-screen p-6">
  <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg sm:w-96 md:w-80 lg:w-96 xl:w-1/3">
    <h2 className="mb-2 text-2xl font-semibold text-center text-white">Download Absentee Report</h2>

        {/* Date input field */}
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-300"
          >
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Gender dropdown */}
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-300"
          >
            Gender:
          </label>
          <select
            id="gender"
            value={gender}
            onChange={handleGenderChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="MALE">BOYS</option>
            <option value="FEMALE">GIRLS</option>
          </select>
        </div>

        {/* Hosteller/Day Scholar dropdown */}
        <div className="mb-4">
          <label
            htmlFor="hostellerDayScholar"
            className="block text-sm font-medium text-gray-300"
          >
            Hostel Type:
          </label>
          <select
            id="hostellerDayScholar"
            value={hostellerDayScholar}
            onChange={handleHostellerDayScholarChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="HOSTELLER">HOSTELLER</option>
            <option value="DAY SCHOLAR">DAY SCHOLAR</option>
          </select>
        </div>

        {/* Year of Study dropdown */}
        <div className="mb-4">
          <label
            htmlFor="yearOfStudy"
            className="block text-sm font-medium text-gray-300"
          >
            Year of Study:
          </label>
          <select
            id="yearOfStudy"
            value={yearOfStudy}
            onChange={handleYearOfStudyChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="II">Second Year</option>
            <option value="III">Third Year</option>
            <option value="IV">Fourth Year</option>
          </select>
        </div>

        {/* Branch dropdown */}
        <div className="mb-4">
          <label
            htmlFor="branch"
            className="block text-sm font-medium text-gray-300"
          >
            Branch:
          </label>
          <select
            id="branch"
            value={branch}
            onChange={handleBranchChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="AIML">ML</option>
            <option value="AIDS">DS</option>
          </select>
        </div>

        {/* Section dropdown */}
        <div className="mb-6">
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-300"
          >
            Section:
          </label>
          <select
            id="section"
            value={section}
            onChange={handleSectionChange}
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        {/* Button to download report */}
        <button
          onClick={handleDownload}
          className="w-full px-4 py-2 font-bold text-white transition duration-300 bg-blue-600 rounded-md shadow hover:bg-blue-700"
        >
          {isLoading ? "Loading..." : "Download Report"}
        </button>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)} // Replace with actual back navigation logic
          className="w-full px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-gray-600 rounded-md shadow hover:bg-gray-700"
        >
          Back
        </button>

        {/* Display message if no students are absent */}
        {message && (
          <p className="mt-4 text-center text-white">{message}</p>
        )}
      </div>

      {/* Toast notifications */}
    
    </div>
  );
};

export default GenerateReport;
