import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation

function DutyPage() {
  const location = useLocation(); // Get location data
  const navigate = useNavigate(); // Hook for navigating to another page
  const { selectedCourse } = location.state || {}; // Retrieve selected course from the state passed by the sidebar

  const [counter, setCounter] = useState(0);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);

  // Increment function to increase the count
  const handleIncrement = () => setCounter(counter + 1);

  // Decrement function to decrease the count (if greater than 0)
  const handleDecrement = () => {
    if (counter > 0) {
      const newCounter = counter - 1;
      setCounter(newCounter);
      setSelectedBoxes((prevSelected) =>
        prevSelected.filter((index) => index < newCounter)
      );
    }
  };

  // Toggle the selection of a specific box by index
  const toggleSelection = (index) => {
    setClickedIndex(index);
    setSelectedBoxes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
    setTimeout(() => setClickedIndex(null), 300); // Reset clicked index after a short delay
  };

  // Handle confirm selection and redirect to Absentees component with non-selected boxes
  const handleConfirmSelection = () => {
    // Get all boxes
    const allBoxes = [...Array(counter)].map((_, index) => index);

    // Filter out selected boxes to get non-selected boxes
    const nonSelectedBoxes = allBoxes.filter((index) => !selectedBoxes.includes(index));

    // Navigate to Absentees page with the non-selected boxes in the state
    navigate("/absentees", { state: { nonSelectedBoxes } });
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      {/* Display the selected course */}
      {selectedCourse && (
        <div className="p-4 text-center text-black">
          <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
          <h3 className="text-2xl font-semibold">ON DUTY</h3>
        </div>
      )}

      {/* Counter section */}
      <div className="flex flex-col items-center mt-6 space-y-4">
        <div className="flex flex-col items-center space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <button
            onClick={handleIncrement}
            className="w-full px-6 py-3 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-md md:w-auto hover:bg-green-600"
          >
            Increment
          </button>

          <span className="text-2xl font-semibold">{counter}</span>
          <button
            onClick={handleDecrement}
            className="w-full px-6 py-3 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md md:w-auto hover:bg-red-600"
          >
            Decrement
          </button>
        </div>
      </div>

      {/* Box grid section */}
      <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {[...Array(counter)].map((_, index) => (
          <div
  key={index}
  onClick={() => toggleSelection(index)}
  className={`flex items-center justify-center p-6 text-white transition-all duration-300 transform rounded-lg shadow-md cursor-pointer 
    ${selectedBoxes.includes(index) ? "bg-blue-600" : "bg-gray-700"} 
    ${clickedIndex === index ? "scale-110" : ""}
    hover:scale-110`} // Add hover effect to scale on hover
>
  <h3 className="text-xl font-semibold">
    {index < 9
      ? `23ADR00${index + 1}`
      : index < 99
      ? `23ADR0${index + 1}`
      : `23ADR${index + 1}`}
  </h3>
</div>
        ))}
      </div>

      {/* Display selected boxes in a grid */}
      {selectedBoxes.length > 0 && (
        <div className="grid w-full gap-4 mt-6 text-2xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {selectedBoxes.map((index) => (
            <div key={index} className="flex justify-center">
              {index < 9
                ? `23ADR00${index + 1}`
                : index < 99
                ? `23ADR0${index + 1}`
                : `23ADR${index + 1}`}
            </div>
          ))}
        </div>
      )}

      {/* Confirm button */}
      <div className="flex flex-col items-center space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <button
          onClick={handleConfirmSelection}
          className="w-full px-6 py-3 mt-10 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md md:w-auto hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default DutyPage;
