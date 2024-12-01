import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function UpdateAttendance() {
  const [yearOfStudy, setYearOfStudy] = useState("nan");
  const [branch, setBranch] = useState("nan");
  const [section, setSection] = useState("nan");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]); // Set default to current date
  const [rollNumbers, setRollNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudentData = async () => {
    if (yearOfStudy === "nan" || branch === "nan" || section === "nan" || !date) {
   
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/attendance/get-attendancestatus", {
        params: {
          yearOfStudy,
          branch,
          section,
          date,
        },
      });

      const { attendanceStates } = response.data;
      setRollNumbers(
        attendanceStates.map((student) => ({
          rollNo: student.rollNo,
          state: student.state,
        }))
      );
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [yearOfStudy, branch, section, date]); // Trigger fetch on field change

  const updateAttendanceStatus = async () => {
    try {
      const rollNumberStateMapping = rollNumbers.reduce((acc, student) => {
        acc[student.rollNo] = student.state;
        return acc;
      }, {});

      const response = await axios.post("http://localhost:5000/api/attendance/mark-updatestatus", {
        yearOfStudy,
        branch,
        section,
        date,
        rollNumberStateMapping,
      });

      toast.success(response.data.message || "Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status.");
    }
  };

  const toggleState = (index) => {
    const updatedRollNumbers = [...rollNumbers];
    const currentState = updatedRollNumbers[index].state;

    const newState =
      currentState === "SuperPacc"
        ? "Absent"
        : currentState === "Absent"
        ? "Present"
        : currentState === "Present"
        ? "On Duty"
        : "SuperPacc";

    updatedRollNumbers[index].state = newState;
    setRollNumbers(updatedRollNumbers);
  };

  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-center text-white">Update Attendance</h1>

        {/* Dropdowns */}
        <div className="flex flex-wrap justify-center w-full mt-4 gap-x-4 gap-y-4">
          <Dropdown
            label="Year"
            value={yearOfStudy}
            options={["IV", "III", "II"]}
            onChange={(e) => {setYearOfStudy(e.target.value);fetchStudentData();}}
            
          />
          <Dropdown
            label="Branch"
            value={branch}
            options={["AIDS", "AIML"]}
            onChange={(e) =>{fetchStudentData(); setBranch(e.target.value)}}
          />
          <Dropdown
            label="Section"
            value={section}
            options={["A", "B", "C"]}
            onChange={(e) => {setSection(e.target.value);fetchStudentData();}}
          />
        </div>

        {/* Date Selection */}
        <div className="flex items-center justify-center pb-5 mt-8">
          <div className="w-full max-w-sm">
            <label htmlFor="date" className="block mb-2 text-lg font-medium text-center text-white">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => {setDate(e.target.value);fetchStudentData();}}
              className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Roll Numbers */}
      {rollNumbers.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {rollNumbers.map((rollNumber, index) => (
            <div
              key={index}
              onClick={() => toggleState(index)}
              className={`flex items-center justify-center p-6 text-white transition-all transform duration-500 text-xl font-semibold rounded-lg cursor-pointer shadow-md ${
                rollNumber.state === "SuperPacc"
                  ? "bg-gray-600"
                  : rollNumber.state === "Absent"
                  ? "bg-red-600"
                  : rollNumber.state === "Present"
                  ? "bg-green-600"
                  : "bg-yellow-600"
              } hover:scale-110`}
            >
              {rollNumber.rollNo}
            </div>
          ))}
        </div>
      )}

      {/* Update Button */}
      {rollNumbers.length > 0 && (
        <button
          onClick={updateAttendanceStatus}
          className="w-full px-6 py-3 mt-6 text-lg text-white transition-all duration-500 bg-gray-800 rounded-lg lg:w-1/4 md:w-1/5 sm:w-1/2 hover:scale-110 hover:bg-gray-600"
        >
          Update Attendance
        </button>
      )}
    </div>
  );
}

function Dropdown({ label, value, options, onChange }) {
  return (
    <div className="flex-1 min-w-[100px] max-w-[150px]">
      <label htmlFor={label} className="block text-lg font-medium text-white">
        {label}:
      </label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-600"
      >
        <option value="nan">{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UpdateAttendance;
