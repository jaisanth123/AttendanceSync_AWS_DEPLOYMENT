import React, { useState, useEffect } from "react";
import axios from "axios";

function Absentees() {
  const [rollNumbers, setRollNumbers] = useState([]);

  useEffect(() => {
    fetchAbsentees();
  }, []);

  // Fetch all roll numbers (for now) from the server
  const fetchAbsentees = async () => {
    const url = "http://localhost:5000/api/students/rollnumbers"; // Adjust URL as per your backend
    try {
      const response = await axios.get(url);

      // Add a default selection state to each roll number
      const fetchedRollNumbers = response.data.students.map((rollNo) => ({
        rollNo,
        isSelected: false, // Default state
      }));

      setRollNumbers(fetchedRollNumbers);
    } catch (error) {
      console.error("Error fetching absentees:", error);
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

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-8 text-4xl font-semibold">Absentees List</h1>
      <div className="grid w-full grid-cols-2 gap-4 mt-6 text-2xl font-semibold sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {rollNumbers.length > 0 ? (
          rollNumbers.map((rollNumber, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`flex items-center justify-center p-6 text-white transition-transform transform text-xl font-semibold rounded-lg cursor-pointer shadow-md
                ${rollNumber.isSelected ? "bg-red-500" : "bg-gray-700"} hover:scale-110`}
            >
              {rollNumber.rollNo}
            </div>
          ))
        ) : (
          <p>No absentees fetched.</p>
        )}
      </div>
    </div>
  );
}

export default Absentees;
