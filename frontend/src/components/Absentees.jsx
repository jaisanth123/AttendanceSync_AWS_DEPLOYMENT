import { useLocation } from "react-router-dom";
import { useState } from "react";

const Absentees = () => {

  const location = useLocation();
  const { selectedCourse, nonSelectedBoxes } = location.state || {};

  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Controls the visibility of the custom popup
  const [isConfirmed, setIsConfirmed] = useState(false); // Enables "Mark Present" button

  const toggleSelection = (index) => {
    setSelectedBoxes((prevSelectedBoxes) =>
      prevSelectedBoxes.includes(index)
        ? prevSelectedBoxes.filter((boxIndex) => boxIndex !== index)
        : [...prevSelectedBoxes, index]
    );
    setClickedIndex(index);
  };

  const handleConfirmClick = () => {
    setIsPopupVisible(true); // Show popup when Confirm is clicked
  };

  const handlePopupOk = () => {
    setIsPopupVisible(false); // Close the popup
    setIsConfirmed(true); // Enable "Mark Present" button
  };

  const handlePopupCancel = () => {
    setIsPopupVisible(false); // Close the popup without enabling "Mark Present"
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



      <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {nonSelectedBoxes && nonSelectedBoxes.length > 0 ? (
          nonSelectedBoxes.map((boxName, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`flex items-center justify-center p-6 text-white transition-all duration-300 transform rounded-lg shadow-md cursor-pointer 
                ${selectedBoxes.includes(index) ? "bg-blue-600" : "bg-gray-700"} 
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

      {selectedBoxes.length > 0 && (
        <div className="w-full mt-6 text-center">
          <div className="grid w-full gap-4 mt-4 text-3xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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

      <div className="flex flex-col items-center mt-8 space-y-4">
        <button
          onClick={handleConfirmClick}
          className="px-6 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
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
          disabled={!isConfirmed}
        >
          Mark Present
        </button>
      </div>

      {/* Custom Popup for Confirmation */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">
              Confirm Submission
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Are you sure you want to confirm this selection?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handlePopupOk}
                className="px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Okay
              </button>
              <button
                onClick={handlePopupCancel}
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
};

export default Absentees;
