import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DutyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [date, setDate] = useState(location.state?.selectedDate || "");
  const [rollNumbers, setRollNumbers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedRollNumbers, setSelectedRollNumbers] = useState([]); // Track selected roll numbers
  const [isConfirmed, setIsConfirmed] = useState(false);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (selectedCourse && date) {
      fetchRollNumbers(selectedCourse, date);
    }
  }, [selectedCourse, date]);

  const fetchRollNumbers = async (course, selectedDate) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    const url = `http://localhost:5000/api/students/rollnumbers?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${selectedDate}`;

    try {
      const response = await axios.get(url);
      const { students, totalStudents } = response.data;
      const formattedDate = formatDate(selectedDate);

      if (totalStudents === 0) {
        setMessage(`No record found for ${yearOfStudy} - ${branch} - ${section}.`);
        setRollNumbers([]);
        return;
      }

      if (students.length === 0) {
        setMessage(`For ${yearOfStudy} - ${branch} - ${section}, students' attendance for ${formattedDate} has already been marked.`);
        setRollNumbers([]);
        return;
      }

      setMessage("");

      const fetchedRollNumbers = students.map((student) => ({
        rollNo: student.rollNo,
        name:student.name,
        isSelected: false,
      }));
      setRollNumbers(fetchedRollNumbers);
    } catch (error) {
      console.error("Error fetching roll numbers:", error);
      setMessage("An error occurred while fetching roll numbers. Please try again later.");
      setRollNumbers([]);
    }
  };

  const toggleSelection = (index) => {
    const rollNo = rollNumbers[index].rollNo;
    setRollNumbers((prevRollNumbers) =>
      prevRollNumbers.map((rollNumber, i) => {
        if (i === index) {
          const updatedSelection = !rollNumber.isSelected;
          
          // If selecting, add to selectedRollNumbers; if deselecting, remove from it
          setSelectedRollNumbers((prevSelected) => {
            if (updatedSelection) {
              // Add roll number if not already present
              if (!prevSelected.includes(rollNo)) {
                return [...prevSelected, rollNo];
              }
            } else {
              // Remove roll number if deselecting
              return prevSelected.filter((rollNoItem) => rollNoItem !== rollNo);
            }
            return prevSelected;
          });
  
          return { ...rollNumber, isSelected: updatedSelection };
        }
        return rollNumber;
      })
    );
  };
  

  const handleConfirm = async () => {
    const [yearOfStudy, branch, section] = selectedCourse.split(" - ");
    const payload = {
      rollNumbers: selectedRollNumbers,
      date,
      yearOfStudy,
      branch,
      section,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/attendance/onDuty", payload);
      if (response.status === 200) {
        alert("Attendance marked successfully!");
        navigate("/absentees", {
          state: { selectedCourse, selectedDate: date },
        });
      } else {
        alert("Failed to mark attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred while submitting attendance. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setIsConfirmed(false);
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {message && (
        <div className="w-full max-w-lg p-4 mt-6 text-lg text-center text-red-500">
          {message}
        </div>
      )}

      {rollNumbers.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {rollNumbers.map((rollNumber, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`flex items-center justify-center p-6 text-white transition-transform transform text-xl font-semibold rounded-lg cursor-pointer shadow-md ${
                rollNumber.isSelected ? "bg-blue-600" : "bg-gray-700"
              } hover:scale-110`}
            >
              {rollNumber.rollNo}
            </div>
          ))}
        </div>
      )}

      {selectedRollNumbers.length > 0 && (
        <div className="w-full max-w-lg p-4 mt-6 text-lg text-center text-black">
          <h4 className="mb-2 font-semibold">Selected Roll Numbers:</h4>
          <p>{selectedRollNumbers.join(", ")}</p>
        </div>
      )}

      <button
        onClick={() => setIsConfirmed(true)}
        className="px-6 py-3 mt-10 text-white bg-red-500 rounded-lg hover:bg-red-600"
        disabled={!date || selectedRollNumbers.length === 0}
      >
        CONFIRM
      </button>

      {isConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="p-8 transition-all duration-500 transform scale-90 bg-gray-800 rounded-lg shadow-lg animate-slideDown">
            <h2 className="mb-4 text-2xl font-semibold text-center text-white">
              Confirm Submission
            </h2>
            <p className="mb-6 text-center text-white">
              Are you sure you want to mark the selected students as absent?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Confirm
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
