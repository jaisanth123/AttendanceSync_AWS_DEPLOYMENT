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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state for updating attendance
  const [attendanceLogs, setAttendanceLogs] = useState([]); // New state for attendance change logs

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
          name: student.name, // Assuming student name is part of the response
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

  const handleClosePopup = () => {
    setIsConfirmed(false);
  };

  const updateAttendanceStatus = async () => {
    handleClosePopup();
    setIsUpdating(true); // Set isUpdating to true when starting the update process

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

      toast.success(response.data.message || "Attendance updated successfully!", {
        autoClose: 800,
      });
      setIsConfirmed(false);
      await fetchStudentData();
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status.");
    } finally {
      setIsUpdating(false); // Reset isUpdating after the process is done
    }
  };
  const [changedStudents, setChangedStudents] = useState([]); // Track students who have changed their attendance

  const toggleState = (index) => {
    const updatedRollNumbers = [...rollNumbers];
    const currentState = updatedRollNumbers[index].state;
    const previousState = currentState;

    const newState =
      currentState === "Present"
        ? "On Duty"
        : currentState === "On Duty"
        ? "SuperPacc"
        : currentState === "SuperPacc"
        ? "Absent"
        : "Present"; // Default to "Present" if it's "Absent"

    updatedRollNumbers[index].state = newState;
    setRollNumbers(updatedRollNumbers);

    // Add log entry for the state change
    const { rollNo, name } = updatedRollNumbers[index];

    // Check if a log already exists for this student and update it
    const existingLogIndex = attendanceLogs.findIndex(
      (log) => log.rollNo === rollNo
    );

    if (existingLogIndex !== -1) {
      // Update the existing log if the student already has a log entry
      const updatedLogs = [...attendanceLogs];
      updatedLogs[existingLogIndex] = {
        rollNo,
        name,
        previousState,
        newState,
      };
      setAttendanceLogs(updatedLogs);
    } else {
      // Add a new log if no log exists for the student
      const newLog = {
        rollNo,
        name,
        previousState,
        newState,
      };
      setAttendanceLogs((prevLogs) => [newLog, ...prevLogs]);
    }
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
            Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => {setDate(e.target.value);fetchStudentData();}}
              max={new Date().toISOString().split("T")[0]} // Restrict future dates
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
          onClick={() => setIsConfirmed(true)}
          disabled={isUpdating} // Disable button when updating
          className={`w-full px-6 py-3 mt-6 text-lg text-white transition-all duration-500 ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800'} rounded-lg lg:w-1/4 md:w-1/5 sm:w-1/2 hover:scale-110 hover:bg-gray-600`}
        >
          {isUpdating ? "Updating Attendance..." : "Update Attendance"} {/* Update button text */}
        </button>
      )}

      {/* Attendance Logs */}
      {attendanceLogs.length > 0 && (
        <div className="w-full max-w-3xl mt-8 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center ">Attendance Change Logs</h2>
          <div className="mt-4">
            {attendanceLogs.map((log, index) => (
              <div key={index} className="flex justify-between mb-3 font-semibold ">
                <span>{log.rollNo} - {log.name}</span>
                <span>{log.previousState} → {log.newState}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {isConfirmed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-white">
              Are you sure you want to update attendance?
            </h2>
            <p className="mt-4 text-lg text-white text-center">
              {rollNumbers.length > 0
                ? `Students Attendance will be updated as specified.`
                : "No students to update."}
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleClosePopup}
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={updateAttendanceStatus}
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dropdown({ label, value, options, onChange }) {
  return (
    <div className="w-full max-w-[250px]">
      <label htmlFor={label} className="block mb-2 text-white">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-gray-600"
      >
        <option value="nan">Select {label}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default UpdateAttendance;
