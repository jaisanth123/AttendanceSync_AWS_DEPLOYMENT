import React from 'react';
import { useNavigate } from 'react-router-dom';

function YearMenu() {
  const navigate = useNavigate();

  const handleClassSelect = (year, section) => {
    navigate(`/attendance/on-duty/${section}`);
  };

  return (
    <div>
      <h2>Select Year</h2>
      <div>
        <button onClick={() => handleClassSelect('2nd', 'AIDS A')}>2nd Year - AIDS A</button>
        {/* Repeat for other classes */}
      </div>
    </div>
  );
}

export default YearMenu;
