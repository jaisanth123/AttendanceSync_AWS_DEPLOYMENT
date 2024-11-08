import React, { useState, useEffect } from "react";

function DutyPage({ selectedCourse }) {
  const [counter, setCounter] = useState(0);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  // Reset state when selectedCourse changes
  useEffect(() => {
    setCounter(0);
    setSelectedBoxes([]);
  }, [selectedCourse]);

  const handleIncrement = () => setCounter(counter + 1);
  const handleDecrement = () => setCounter(counter > 0 ? counter - 1 : 0);

  const toggleSelection = (index) => {
    setSelectedBoxes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleConfirmSelection = () => {
    console.log("Confirmed selected boxes:", selectedBoxes);
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      <div className="flex flex-col items-center mt-6 space-y-4">
        <div className="flex flex-col items-center space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <button
            onClick={handleDecrement}
            className="w-full px-6 py-3 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md md:w-auto hover:bg-red-600"
          >
            Decrement
          </button>
          <span className="text-2xl font-semibold">{counter}</span>
          <button
            onClick={handleIncrement}
            className="w-full px-6 py-3 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-md md:w-auto hover:bg-green-600"
          >
            Increment
          </button>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {[...Array(counter)].map((_, index) => (
          <div
            key={index}
            onClick={() => toggleSelection(index)}
            className={`flex items-center justify-center p-6 text-white rounded-lg shadow-md cursor-pointer 
              ${selectedBoxes.includes(index) ? "bg-blue-600" : "bg-gray-700"}`}
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

      <div className="grid w-full gap-4 mt-6 text-2xl font-semibold text-gray-800 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {selectedBoxes.length > 0
          ? selectedBoxes.map((index) => (
              <div key={index} className="flex justify-center">
                {index < 9
                  ? `23ADR00${index + 1}`
                  : index < 99
                  ? `23ADR0${index + 1}`
                  : `23ADR${index + 1}`}
              </div>
            ))
          : ""}
      </div>

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
