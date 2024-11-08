import React, { useState } from "react";
import { AiOutlineHome, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// YearSection Component to handle the individual year sections
const YearSection = ({
  year,
  expandedYear,
  toggleYear,
  courses,
  handleItemSelection,
}) => (
  <div>
    <div
      className="flex items-center justify-between mt-6 mb-4 text-lg font-medium transition-all duration-200 cursor-pointer hover:font-bold hover:scale-110"
      onClick={() => toggleYear(year)}
      aria-expanded={expandedYear === year}
      role="button"
      aria-label={`Toggle ${year} Year courses`}
    >
      <span>{year} Year</span>
      {expandedYear === year ? <AiOutlineUp /> : <AiOutlineDown />}
    </div>
    {expandedYear === year && (
      <div className="pl-6 space-y-3 text-md">
        {courses.map((course, index) => (
          <p
            key={index}
            className="p-2 transition-all duration-200 cursor-pointer hover:font-bold hover:scale-110"
            onClick={() => handleItemSelection(course, year)}
            role="button"
            aria-label={`Select ${course} course`}
          >
            {course}
          </p>
        ))}
      </div>
    )}
  </div>
);

function Sidebar({ closeSidebar, handleItemSelection }) {
  const [expandedYear, setExpandedYear] = useState(null);

  const toggleYear = (year) => {
    setExpandedYear((prevYear) => (prevYear === year ? null : year));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={closeSidebar}
        aria-label="Close Sidebar"
      ></div>

      <div
        className="fixed inset-y-0 left-0 w-64 p-6 text-white bg-gray-800 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between mb-6 cursor-pointer"
          onClick={closeSidebar}
          aria-label="Close Sidebar"
        >
          <AiOutlineHome className="mr-3 text-2xl hover:text-gray-300" />
          <span className="text-xl font-semibold hover:text-gray-300">Home</span>
        </div>

        {/* Year Sections */}
        <YearSection
          year="2nd"
          expandedYear={expandedYear}
          toggleYear={toggleYear}
          courses={["AIDS - A", "AIDS - B", "AIDS - C", "AIML - A", "AIML - B"]}
          handleItemSelection={handleItemSelection}
        />

        <YearSection
          year="3rd"
          expandedYear={expandedYear}
          toggleYear={toggleYear}
          courses={["AIDS - A", "AIDS - B", "AIML - A", "AIML - B"]}
          handleItemSelection={handleItemSelection}
        />

        <YearSection
          year="4th"
          expandedYear={expandedYear}
          toggleYear={toggleYear}
          courses={["AIDS", "AIML"]}
          handleItemSelection={handleItemSelection}
        />
      </div>
    </div>
  );
}

export default Sidebar;
