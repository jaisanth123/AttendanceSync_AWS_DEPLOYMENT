import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DutyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [rollNumbers, setRollNumbers] = useState([]);
  const [date, setDate] = useState(""); // State to store the selected date
  const [message, setMessage] = useState(""); // State to store informational messages

  // Utility function to format the date
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch roll numbers when selectedCourse or date changes
  useEffect(() => {
    if (selectedCourse && date) {
      fetchRollNumbers(selectedCourse, date);
    }
  }, [selectedCourse, date]);

  // Fetch students without attendance from the server
  const fetchRollNumbers = async (course, selectedDate) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    const url = `http://localhost:5000/api/students/rollnumbers?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${selectedDate}`;

    try {
      const response = await axios.get(url);
      const { students, totalStudents } = response.data;

      const formattedDate = formatDate(selectedDate);

      // Handle cases based on the response
      if (totalStudents === 0) {
        setMessage(`No record found for ${yearOfStudy} - ${branch} - ${section}.`);
        setRollNumbers([]); // Clear roll numbers
        return;
      }

      if (students.length === 0) {
        setMessage(`For ${yearOfStudy} - ${branch} - ${section}, students' attendance for ${formattedDate} has already been marked.`);
        setRollNumbers([]); // Clear roll numbers
        return;
      }

      // Reset the message if everything is okay
      setMessage("");

      // Add 'isSelected' property to each roll number
      const fetchedRollNumbers = students.map((student) => ({
        rollNo: student,
        isSelected: false, // Default state for each roll number
      }));

      setRollNumbers(fetchedRollNumbers);
    } catch (error) {
      console.error("Error fetching roll numbers:", error);
      setMessage("An error occurred while fetching roll numbers. Please try again later.");
      setRollNumbers([]); // Handle error gracefully
    }
  };

  // Toggle the selection state of a roll number
  const toggleSelection = (index) => {
    setRollNumbers((prevRollNumbers) =>
      prevRollNumbers.map((rollNumber, i) =>
        i === index
          ? { ...rollNumber, isSelected: !rollNumber.isSelected } // Toggle selection
          : rollNumber
      )
    );
  };

  // Handle confirm selection and navigate to absentees page
  const handleConfirmSelection = () => {
    const nonSelectedBoxes = rollNumbers
      .map((rollNumber, index) => (!rollNumber.isSelected ? index : null))
      .filter((index) => index !== null);

    navigate("/absentees", { state: { nonSelectedBoxes, date, selectedCourse } });
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      {/* Selected Course Display */}
      <div className="p-4 text-center text-black">
        <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
        <h3 className="text-2xl font-semibold">ON DUTY</h3>
      </div>

      {/* Date Picker */}
      <div className="w-full max-w-sm mt-4">
        <label htmlFor="date" className="block mb-2 text-lg font-medium">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Display Message */}
      {message && (
        <div className="w-full max-w-lg p-4 mt-6 text-lg text-center text-red-500">
          {message}
        </div>
      )}

      {/* Roll Number Buttons */}
      {rollNumbers.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {rollNumbers.map((rollNumber, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`flex items-center justify-center p-6 text-white transition-transform transform text-xl font-semibold rounded-lg cursor-pointer shadow-md
              ${rollNumber.isSelected ? "bg-blue-600" : "bg-gray-700"} hover:scale-110`}
            >
              {rollNumber.rollNo}
            </div>
          ))}
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirmSelection}
        className="px-6 py-3 mt-10 text-white bg-red-500 rounded-lg hover:bg-red-600"
        disabled={!date} // Disable button if no date is selected
      >
        Confirm
      </button>
    </div>
  );
}

export default DutyPage;
