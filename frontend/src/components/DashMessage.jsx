import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const DashMessage = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedBranch, setSelectedBranch] = useState("Select Branch");
  const [selectedSection, setSelectedSection] = useState("Select Section");
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState([]);
  const [missingStudents, setMissingStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCard, setShowCard] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
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
      toast.info("Content copied to clipboard!", { autoClose: 800 });
    } catch (err) {
      toast.error("Failed to copy content!", { autoClose: 800 });
    }
    selection.removeAllRanges();
  };

  const getAbsentStudents = async () => {
    if (
      selectedYear === "Select Year" ||
      selectedBranch === "Select Branch" ||
      selectedSection === "Select Section"
    ) {
      toast.error("Please select valid Year, Branch, and Section!", { autoClose: 1500 });
      return;
    }

    const course = `${selectedYear} - ${selectedBranch} - ${selectedSection}`;
    const formattedDate = selectedDate ? selectedDate.split("-").reverse().join("/") : "";

    try {
      const response = await axios.get(
        `http://localhost:5000/api/report/absentStudents?yearOfStudy=${selectedYear}&branch=${selectedBranch}&section=${selectedSection}&date=${formattedDate}`
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-8 text-white bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center md:text-3xl lg:text-4xl">Message Report</h1>
        <h3 className="mt-2 mb-4 text-base font-semibold text-center md:text-lg lg:text-xl">
          {formatDate(selectedDate)}
        </h3>

        <div className="flex flex-col items-center gap-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <select
              className="px-4 py-2 text-white bg-gray-700 border rounded-md focus:outline-none focus:ring"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="Select Year">Select Year</option>
              <option value="IV">IV</option>
              <option value="III">III</option>
              <option value="II">II</option>
            </select>

            <select
              className="px-4 py-2 text-white bg-gray-700 border rounded-md focus:outline-none focus:ring"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="Select Branch">Select Branch</option>
              <option value="AIML">ML</option>
              <option value="AIDS">DS</option>
            </select>

            <select
              className="px-4 py-2 text-white bg-gray-700 border rounded-md focus:outline-none focus:ring"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="Select Section">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <input
            type="date"
            className="px-4 py-2 mt-2 text-white bg-gray-700 border rounded-md focus:outline-none focus:ring"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button
            onClick={() => {
              getAbsentStudents();
              toggleCardVisibility();
            }}
            className="w-full px-6 py-2 mt-4 font-semibold text-white duration-500 transform bg-blue-600 rounded-lg shadow-lg hover:scale-105 transistion sm:w-64 md:w-64 hover:bg-blue-700"
          >
            Get Absent Students
          </button>

          {showCard && (message || details.length > 0 || missingStudents.length > 0 || errorMessage) && (
            <div className="w-full p-6 mt-6 text-gray-200 bg-gray-700 rounded-lg shadow-lg">
              <div id="cardContent">
                {message && (
                  <p
                    className="font-semibold"
                    dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br />") }}
                  />
                )}

                {details.length > 0 && (
                  <ul className="mt-4 list-disc list-inside">
                    {details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}

                {missingStudents.length > 0 && (
                  <p className="mt-4">Missing Absentees: {missingStudents.length}</p>
                )}

                {errorMessage && (
                  <div className="p-3 mt-4 text-red-400 bg-red-800 rounded">
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>

              <button
                onClick={copyCardContent}
                className="px-4 py-2 mt-4 font-semibold text-white duration-500 bg-green-500 rounded hover:scale-105 transistion hover:bg-green-600"
              >
                Copy Content
              </button>
            </div>
          )}



                    <button
            onClick={() => navigate(-1)} // Navigate to home
            className="w-full px-6 py-2 font-semibold text-white duration-500 bg-gray-600 rounded-lg shadow-lg hover:scale-105 transistion sm:w-64 md:w-64 hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Back
          </button>
    

          <button
            onClick={() => navigate("/")} // Navigate to home
            className="w-full px-6 py-2 font-semibold text-white duration-500 bg-gray-600 rounded-lg shadow-lg hover:scale-105 transistion sm:w-64 md:w-64 hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Home
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashMessage;
