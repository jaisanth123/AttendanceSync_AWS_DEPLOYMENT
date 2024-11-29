import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillTriangleFill } from "react-icons/bs";
import { MdClose } from "react-icons/md"; 
import { useNavigate } from "react-router-dom"; 

const YearSection = ({ year, expandedYear, toggleYear, courses, handleItemSelection }) => (
  <div>
    <div
      className="flex items-center justify-between mt-6 mb-4 text-lg font-medium transition-all duration-300 cursor-pointer hover:text-gray-200 hover:scale-110"
      onClick={() => toggleYear(year)}
      aria-expanded={expandedYear === year}
    >
      <span>{year} Year</span>
      <BsFillTriangleFill className={`transition-transform ${expandedYear === year ? "rotate-0" : "-rotate-180"} text-sm`} />
    </div>
    {expandedYear === year && (
      <div className="pl-6 space-y-3 text-gray-300 text-md">
        {courses.map((course, index) => (
          <p
            key={index}
            onClick={() => handleItemSelection(course)}
            className="p-2 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-gray-100 hover:scale-110"
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
  const navigate = useNavigate();

  const toggleYear = (year) => setExpandedYear(prevYear => prevYear === year ? null : year);
  const handleHomeClick = () => {
    closeSidebar();
    navigate("/homePage");
  };

  const handleCourseSelection = (course) => {
    closeSidebar();
    handleItemSelection(course);
    navigate("/absentees", { state: { selectedCourse: course } });
    window.location.reload();
    
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black opacity-50" onClick={closeSidebar}></div>
      <div className="fixed inset-y-0 left-0 w-64 p-6 text-white bg-gradient-to-b from-gray-900 to-gray-800 md:w-80" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div onClick={handleHomeClick} className="flex items-center cursor-pointer">
            <AiOutlineHome className="text-2xl hover:text-gray-300" />
            <span className="ml-2 text-xl font-semibold hover:text-gray-300">Home</span>
          </div>
          <MdClose onClick={closeSidebar} className="text-2xl cursor-pointer hover:text-gray-300" />
        </div>

        <YearSection year="2nd" expandedYear={expandedYear} toggleYear={toggleYear} courses={["II - AIDS - A", "II - AIDS - B", "II - AIDS - C", "II - AIML - A", "II - AIML - B"]} handleItemSelection={handleCourseSelection} />
        <YearSection year="3rd" expandedYear={expandedYear} toggleYear={toggleYear} courses={["III - AIDS - A", "III - AIDS - B", "III - AIML - A", "III - AIML - B"]} handleItemSelection={handleCourseSelection} />
        <YearSection year="4th" expandedYear={expandedYear} toggleYear={toggleYear} courses={["IV - AIDS", "IV - AIML"]} handleItemSelection={handleCourseSelection} />
      </div>
    </div>
  );
}

export default Sidebar;
