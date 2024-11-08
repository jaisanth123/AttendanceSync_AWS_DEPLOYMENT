import { useLocation } from "react-router-dom";
import { useState } from "react";

const Absentees = () => {
  const location = useLocation();
  const { selectedCourse, nonSelectedBoxes } = location.state || {};

  // State to track selected boxes, the index of the clicked box, and confirm status
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isSubmitConfirmed, setIsSubmitConfirmed] = useState(false); // Tracks if submit was confirmed
  const [isConfirmed, setIsConfirmed] = useState(false); // Enables "Mark Present" button

  const toggleSelection = (index) => {
    setSelectedBoxes((prevSelectedBoxes) =>
      prevSelectedBoxes.includes(index)
        ? prevSelectedBoxes.filter((boxIndex) => boxIndex !== index)
        : [...prevSelectedBoxes, index]
    );
    setClickedIndex(index);
  };

  const handleSubmit = () => {
    // Show confirmation dialog on submit
    const confirmSubmit = window.confirm("Are you sure you want to confirm this selection?");
    if (confirmSubmit) {
      setIsSubmitConfirmed(true); // Enable Confirm button
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true); // Enable Mark Present button when confirmed
  };

  const handleMarkPresent = () => {
    console.log("Marked present for selected boxes:", selectedBoxes);
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      {selectedCourse && (
        <div className="p-4 text-center text-black">
          <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
          <h3 className="text-2xl font-semibold">ABSENTEES</h3>
        </div>
      )}

      {/* Display the non-selected boxes in a grid, starting from 1 */}
      <div className="grid grid-cols-2 gap-4 mt-6 text-2xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {nonSelectedBoxes && nonSelectedBoxes.length > 0 ? (
          nonSelectedBoxes.map((boxName, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`flex items-center justify-center p-6 text-white transition-all duration-300 transform rounded-lg shadow-md cursor-pointer 
                ${selectedBoxes.includes(index) ? "bg-blue-600" : "bg-gray-700"} 
                ${clickedIndex === index ? "" : ""}
                hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300`}
            >
              <h3 className="text-xl font-semibold">
                {boxName < 9
                  ? `23ADR00${boxName + 1}`
                  : boxName < 99
                  ? `23ADR0${boxName + 1}`
                  : `23ADR${boxName + 1}`}
              </h3>
            </div>
          ))
        ) : (
          <p>No non-selected boxes</p>
        )}
      </div>

      {/* Display selected boxes below the grid */}
      {selectedBoxes.length > 0 && (
        <div className="w-full mt-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Selected Boxes</h3>
          <div className="grid w-full gap-4 mt-4 text-xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {selectedBoxes.map((boxIndex) => (
              <div key={boxIndex} className="flex justify-center">
                <h3>
                  {boxIndex < 9
                    ? `23ADR00${boxIndex + 1}`
                    : boxIndex < 99
                    ? `23ADR0${boxIndex + 1}`
                    : `23ADR${boxIndex + 1}`}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit, Confirm, and Mark Present buttons */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Submit
        </button>
        <button
          onClick={handleConfirm}
          className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-4 ${
            isSubmitConfirmed
              ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isSubmitConfirmed} // Disable button until submit is confirmed
        >
          Confirm
        </button>
        <button
          onClick={handleMarkPresent}
          className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-4 ${
            isConfirmed
              ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isConfirmed} // Disable button until confirmed
        >
          Mark Present
        </button>
      </div>
    </div>
  );
};

export default Absentees;
