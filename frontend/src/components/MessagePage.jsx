import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const MessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate || "");

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState([]);
  const [missingStudents, setMissingStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <div>
      <h1>Attendance Report</h1>
      <p>Course: {selectedCourse}</p>
      <p>Date: {selectedDate}</p>
      
      {/* Button to trigger the API call */}
      <button onClick={() => getAbsentStudents(selectedCourse, selectedDate)}>
        Get Absent Students
      </button>

      {/* Display message or error */}
      {message && <p>{message}</p>}

      {/* Display details if available and ensure it's an array */}
      {Array.isArray(details) && details.length > 0 && (
        <div>
          <h3>Details:</h3>
          <ul>
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display count of missing students if available */}
      {missingStudents && missingStudents.length > 0 && (
        <div>
          <h3>Missing Students Count:</h3>
          <p>{missingStudents.length}</p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default MessagePage;
