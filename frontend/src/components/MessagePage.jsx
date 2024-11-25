import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const MessagePage = ({ toggleSidebar }) => {
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

    const range = document.createRange();
    range.selectNodeContents(cardContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      toast.info("Content copied to clipboard!", {
        autoClose: 800,
      });
    } catch (err) {
      toast.error("Failed to copy content!", {
        autoClose: 800,
      });
    }

    selection.removeAllRanges();
  };

  const formatTextWithLineBreaks = (text) => {
    return text.replace(/\n/g, "<br />");
  };

  const getAbsentStudents = async (course, date) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/report/absentStudents?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${date}`
      );

      if (response.data.message) {
        setMessage(response.data.message);

        const detailsArray = response.data.details ? response.data.details.split("\n") : [];
        setDetails(detailsArray);
        setMissingStudents(response.data.missingStudents || []);
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
        setMissingStudents(error.response.data.missingStudents || []);
        setMessage("");
        setDetails([]);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        setMissingStudents([]);
      }
    }
  };

  const toggleCardVisibility = () => {
    setShowCard(!showCard);
  };

  return (
    <div className="p-4 text-center text-black">
      <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{selectedCourse}</h1>
      <h3 className="text-lg font-semibold md:text-xl lg:text-2xl">Message Page</h3>
      <h3 className="mt-2 text-base font-semibold md:text-lg lg:text-xl">{formatDate(selectedDate)}</h3>

      <div className="flex flex-col items-center gap-y-4">
        <button
          onClick={() => {
            getAbsentStudents(selectedCourse, selectedDate);
            toggleCardVisibility();
          }}
          className="px-6 py-2 mt-4 font-semibold text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Get Absent Students
        </button>

        {showCard && (message || details.length > 0 || missingStudents.length > 0 || errorMessage) && (
          <div className="w-full h-auto p-6 mx-auto mt-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2">
            <div id="cardContent">
              {message && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-800" dangerouslySetInnerHTML={{ __html: formatTextWithLineBreaks(message) }} />
                </div>
              )}

              {Array.isArray(details) && details.length > 0 && (
                <div className="mt-4">
                  <ul className="mt-2 space-y-2 text-gray-700 list-none">
                    {details.map((detail, index) => (
                      <li key={index} className="font-bold">{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 mt-4 border border-red-300 rounded bg-red-50">
                  <p className="text-red-600">{errorMessage}</p>
                </div>
              )}
              {missingStudents.length > 0 && (
                <div className="mt-4">
                  <p className="text-xl">Count of Missing Absentees Records: {missingStudents.length}</p>
                </div>
              )}
            </div>
            

            <button
              onClick={copyCardContent}
              className="px-6 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Copy Content
            </button>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="px-6 py-2 mt-4 font-semibold text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
        >
          ATTENDENCE
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MessagePage;