import { useLocation } from "react-router-dom";
import { useState } from "react";

const Absentees = ({ selectedCourse }) => {
  const location = useLocation();
  const { nonSelectedBoxes } = location.state || {}; // Only destructuring nonSelectedBoxes
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [popupType, setPopupType] = useState("");

  const toggleSelection = (index) => {
    setSelectedBoxes((prevSelectedBoxes) =>
      prevSelectedBoxes.includes(index)
        ? prevSelectedBoxes.filter((boxIndex) => boxIndex !== index)
        : [...prevSelectedBoxes, index]
    );
    setClickedIndex(index);
  };

  const showPopup = (type) => {
    setPopupType(type); // Set type of popup ("confirm" or "attendance")
    setIsPopupVisible(true); // Show popup
  };

  const handlePopupOk = () => {
    setIsPopupVisible(false); // Close popup
    if (popupType === "confirm") {
      setIsConfirmed(true); // Enable "Mark Present" button for confirmation
    }
  };

  const handlePopupCancel = () => {
    setIsPopupVisible(false); // Close popup without action
  };

  const handleMarkPresent = () => {
    console.log("Marked present for selected boxes:", selectedBoxes);
  };

  return (
    
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
    
        <div className="p-4 text-center text-black">
          <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
          <h3 className="text-2xl font-semibold">ABSENTEES</h3>
        </div>
    
    
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
      ""
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
          onClick={() => showPopup("confirm")}
          className="px-6 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Confirm
        </button>
        <button
          onClick={() => showPopup("attendance")}
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

      {/* Animated Custom Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="p-8 transition-all duration-500 transform scale-90 bg-gray-800 rounded-lg shadow-lg animate-slideDown">
            <h2 className="mb-4 text-2xl font-semibold text-center text-white">
              {popupType === "confirm" ? "Confirm Selection" : "Mark Attendance"}
            </h2>
            <p className="mb-6 text-center text-white">
              {popupType === "confirm"
                ? "Are you sure you want to mark them as absent?"
                : "Are you sure you want to mark Remaining as present?"}
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
