import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DutyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Default selected course from state or fallback to "Select a course"
  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  
  // Default date set from state if available, or an empty string
  const [date, setDate] = useState(location.state?.selectedDate || "");
  
  const [rollNumbers, setRollNumbers] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false); // State for the confirmation popup

  useEffect(() => {
    if (selectedCourse && date) {
      fetchRollNumbers(selectedCourse, date);
    }
  }, [selectedCourse, date]);

  // Fetch roll numbers when selectedCourse or date changes
  const fetchRollNumbers = async (course, selectedDate) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    const url = `http://localhost:5000/api/students/rollnumbers?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${selectedDate}`;
    try {
      const response = await axios.get(url);
      const fetchedRollNumbers = response.data.students.map((student) => ({
        rollNo: student,
        isSelected: false,
      }));
      setRollNumbers(fetchedRollNumbers);
    } catch (error) {
      console.error("Error fetching roll numbers:", error);
      setRollNumbers([]);
    }
  };

  const toggleSelection = (index) => {
    setRollNumbers((prevRollNumbers) =>
      prevRollNumbers.map((rollNumber, i) =>
        i === index
          ? { ...rollNumber, isSelected: !rollNumber.isSelected }
          : rollNumber
      )
    );
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleClosePopup = () => {
    setIsConfirmed(false);
  };

  const handleRedirect = () => {
    // Perform the redirection after confirmation
    setIsConfirmed(false); // Close the popup
    navigate("/absentees", {
      state: { selectedCourse, selectedDate: date }, // Passing the course and date back
    });
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      <div className="p-4 text-center text-black">
        <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
        <h3 className="text-2xl font-semibold">ON DUTY</h3>
      </div>
      
      <div className="w-full max-w-sm mt-4">
        <label htmlFor="date" className="block mb-2 text-lg font-medium">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date} // Set the value of date input to the selected date
          onChange={(e) => setDate(e.target.value)} // Update date state
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

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

      <button
        onClick={handleConfirm}
        className="px-6 py-3 mt-10 text-white bg-red-500 rounded-lg hover:bg-red-600"
        disabled={!date} // Disable button if no date is selected
      >
        CONFRIM
      </button>

      {/* Confirmation Popup */}
      {isConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="p-8 transition-all duration-500 transform scale-90 bg-gray-800 rounded-lg shadow-lg animate-slideDown">
            <h2 className="mb-4 text-2xl font-semibold text-center text-white">
              Confirm Selection
            </h2>
            <p className="mb-6 text-center text-white">
              Are you sure you want to mark them as absent?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRedirect} // Redirection happens here
                className="px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Okay
              </button>
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 font-semibold text-white transition-all bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DutyPage;
