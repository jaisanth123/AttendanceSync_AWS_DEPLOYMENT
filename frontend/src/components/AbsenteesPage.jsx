import React from "react";
import { useLocation } from "react-router-dom";

function Absentees() {
  const location = useLocation();
  const { selectedBoxes } = location.state || { selectedBoxes: [] };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-8 text-4xl font-semibold">Absentees List</h1>
      <div className="grid w-full gap-4 mt-6 text-2xl font-semibold">
        {selectedBoxes.length > 0 ? (
          selectedBoxes.map((index) => (
            <div key={index} className="p-4 bg-gray-300 rounded-lg">
              Box {index < 9 ? `23ADR00${index + 1}` : index < 99 ? `23ADR0${index + 1}` : `23ADR${index + 1}`}
            </div>
          ))
        ) : (
          <p>No absentees selected.</p>
        )}
      </div>
    </div>
  );
}

export default Absentees;
