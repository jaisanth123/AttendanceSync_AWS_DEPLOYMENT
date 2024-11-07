import React, { useState } from "react";
import { AiOutlineHome, AiOutlineDown, AiOutlineUp } from "react-icons/ai";

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
            onClick={() => handleItemSelection(course)} // Update selected item
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
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-white opacity-50"
        onClick={closeSidebar}
      ></div>
      <div className="fixed inset-y-0 left-0 w-64 p-6 text-white transition-all duration-300 ease-in-out bg-gray-800 shadow-lg sidebar">
        <div
          className="flex items-center justify-between mb-6 cursor-pointer"
          onClick={closeSidebar}
        >
          <AiOutlineHome className="mr-3 text-2xl" />
          <span className="text-xl font-semibold">Home</span>
        </div>

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
