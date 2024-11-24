import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const MessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || "");

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState([]);
  const [missingStudents, setMissingStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [showCard, setShowCard] = useState(false);

  // Format the date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const copyCardContent = () => {
    const cardContent = document.getElementById("cardContent");

    // Create a range and selection to select the content
    const range = document.createRange();
    range.selectNodeContents(cardContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      toast.info("Content copied to clipboard!",{
        autoClose: 800, 
      }); // Use react-toastify for the success message
    } catch (err) {
      toast.error("Failed to copy content!",{
        autoClose: 800, 
      }); // Error toast if it fails
    }

    selection.removeAllRanges();
  };

  // API call function
  const getAbsentStudents = async (course, date) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/report/absentStudents?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${date}`
      );

      if (response.data.message) {
        setMessage(response.data.message);

        // If the details are in a string, split them by the newline character to make it an array
        const detailsArray = response.data.details ? response.data.details.split("\n") : [];
        setDetails(detailsArray);
        setMissingStudents(response.data.missingStudents || []);
        setErrorMessage(""); // Clear previous errors
      }
    } catch (error) {
      if (error.response) {
        // Error response from the server
        setErrorMessage(error.response.data.message);
        setMissingStudents(error.response.data.missingStudents || []);
        setMessage(""); // Clear message if error
        setDetails([]); // Clear details if error
      } else {
        // No response from the server or network error
        setErrorMessage("An error occurred. Please try again later.");
        setMissingStudents([]); // Clear missingStudents if error
      }
    }
  };

  const toggleCardVisibility = () => {
    setShowCard(!showCard);
  };

  return (
    <div className="p-4 text-center text-black">
      <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
      <h3 className="text-2xl font-semibold">Message Page</h3>
      <h3 className="mt-2 text-xl font-semibold">{formatDate(selectedDate)}</h3>

      {/* Button to trigger the API call */}
      <button
        onClick={() => { getAbsentStudents(selectedCourse, selectedDate); toggleCardVisibility(); }}
        className="mt-4 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Get Absent Students
      </button>

      {/* Display all the contents inside a single card */}
      {showCard && (message || details.length > 0 || missingStudents.length > 0 || errorMessage) && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6 border-2 border-gray-300 w-96 h-96 mx-auto">
          {/* Content that will be copied */}
          <div id="cardContent">
            {/* Display message */}
            {message && (
              <div className="mt-4">
                <p className="font-semibold text-gray-800">{message}</p>
              </div>
            )}

            {/* Display details */}
            {Array.isArray(details) && details.length > 0 && (
              <div className="mt-4">
                <ul className="list-none space-y-2 mt-2 text-gray-700">
                  {details.map((detail, index) => (
                    <li key={index} className="font-bold">{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display count of missing students */}
            {missingStudents.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-700">{missingStudents.length}</p>
              </div>
            )}

            {/* Display error message */}
            {errorMessage && (
              <div className="mt-4 bg-red-50 p-3 rounded border border-red-300">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Button to copy content */}
          <button
            onClick={copyCardContent}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Copy Content
          </button>
        </div>
      )}

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default MessagePage;
