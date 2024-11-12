import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DutyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [counter, setCounter] = useState(0);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  // Reset state when selectedCourse changes
  useEffect(() => {
    if (location.state?.selectedCourse) {
      setSelectedCourse(location.state.selectedCourse);
      setCounter(0);           // Reset counter
      setSelectedBoxes([]);     // Clear selected boxes
    }
  }, [location.state?.selectedCourse]);

  const handleIncrement = () => setCounter(counter + 1);
  const handleDecrement = () => setCounter(Math.max(counter - 1, 0));

  const toggleSelection = (index) => {
    setSelectedBoxes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleConfirmSelection = () => {
    const allBoxes = Array.from({ length: counter }, (_, i) => i);
    const nonSelectedBoxes = allBoxes.filter((i) => !selectedBoxes.includes(i));
    navigate("/absentees", { state: { nonSelectedBoxes } });
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      {/* Selected Course Display */}
      <div className="p-4 text-center text-black">
        <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
        <h3 className="text-2xl font-semibold">ON DUTY</h3>
      </div>

      {/* Counter Section */}
      <div className="flex items-center mt-6 space-x-4">
        <button onClick={handleIncrement} className="px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600">Increment</button>
        <span className="text-2xl font-semibold">{counter}</span>
        <button onClick={handleDecrement} className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600">Decrement</button>
      </div>

      {/* Box Grid */}
      <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: counter }, (_, i) => (
          <div
            key={i}
            onClick={() => toggleSelection(i)}
            className={`p-6 text-white transition-transform transform rounded-lg cursor-pointer shadow-md
              ${selectedBoxes.includes(i) ? "bg-blue-600" : "bg-gray-700"} hover:scale-110`}
          >
            {`23ADR${i < 9 ? "00" : i < 99 ? "0" : ""}${i + 1}`}
          </div>
        ))}
      </div>

      {/* Selected Boxes */}
      {selectedBoxes.length > 0 && (
        <div className="grid w-full gap-4 mt-6 text-2xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {selectedBoxes.map((index) => (
            <div key={index}>{`23ADR${index < 9 ? "00" : index < 99 ? "0" : ""}${index + 1}`}</div>
          ))}
        </div>
      )}

      {/* Confirm Button */}
      <button onClick={handleConfirmSelection} className="px-6 py-3 mt-10 text-white bg-red-500 rounded-lg hover:bg-red-600">Confirm</button>
    </div>
  );
}

export default DutyPage;
