import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Absentees() {
  const location = useLocation();
  const navigate = useNavigate();

  // State variables
  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || "Select a course");
  const [date, setDate] = useState(location.state?.selectedDate || "");
  const [rollNumbers, setRollNumbers] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false); // For Confirm button state
  const [showBackPopup, setShowBackPopup] = useState(false); // For Back button confirmation popup
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // For Confirm button confirmation popup
  const [showMarkPresentPopup, setShowMarkPresentPopup] = useState(false); // For Mark Present button confirmation popup
  const [popupMessage, setPopupMessage] = useState(""); // To dynamically update popup messages
  const [popupColor, setPopupColor] = useState(""); // To dynamically update popup colors
  const [selectedRollNos, setSelectedRollNos] = useState([]); // To keep track of selected roll numbers
  const [markPresentDisabled, setMarkPresentDisabled] = useState(true); // Disable Mark Present button initially
  const [markPresentVisible, setMarkPresentVisible] = useState(false);
  


  useEffect(() => {
    if (selectedCourse && date) {
      fetchRollNumbers(selectedCourse, date);
    }
  }, [selectedCourse, date]);

  // Fetch roll numbers when selectedCourse or date changes
  const fetchRollNumbers = async (course, selectedDate) => {
    const [yearOfStudy, branch, section] = course.split(" - ");
    const url = `http://localhost:5000/api/attendance/remaining?yearOfStudy=${yearOfStudy}&branch=${branch}&section=${section}&date=${selectedDate}`;
    try {
      const response = await axios.get(url);
      const fetchedRollNumbers = response.data.students.map((student) => ({
        rollNo: student.rollNo,
        isSelected: false,
      }));
      setRollNumbers(fetchedRollNumbers);
    } catch (error) {
      console.error("Error fetching roll numbers:", error);
      setRollNumbers([]);
    }
  };

  // Toggle selection of roll numbers
  const toggleSelection = (index) => {
    setRollNumbers((prevRollNumbers) => {
      const newRollNumbers = prevRollNumbers.map((rollNumber, i) =>
        i === index
          ? { ...rollNumber, isSelected: !rollNumber.isSelected }
          : rollNumber
      );
      // Update selectedRollNos array
      const selected = newRollNumbers.filter((rollNumber) => rollNumber.isSelected);
      setSelectedRollNos(selected.map((rollNumber) => rollNumber.rollNo));
      // If any roll numbers are selected, enable Mark Present button
      setMarkPresentDisabled(selected.length === 0);
      return newRollNumbers;
    });
  };

  // Handle confirming the absentee list
  const handleConfirm = () => {
    const numSelected = selectedRollNos.length;
  
    if (numSelected === 0) {
      // Case 1: No roll numbers selected
      setPopupMessage("No one marked absent. Click confirm to proceed.");
      setPopupColor("bg-red-600"); // Red for confirmation popup
      setShowConfirmationPopup(true); // Show confirmation popup
    } else {
      // Case 2: Roll numbers are selected
      setPopupMessage(`${numSelected} students marked as absent. Click confirm to proceed.`);
      setPopupColor("bg-red-600");
      setShowConfirmationPopup(true);
    }
  };
  

  // Handle the "Back" button action
  const handleBackButton = () => {
    setPopupMessage("Are you sure you want to go back to the Duty page?");
    setPopupColor("bg-blue-600"); // Blue for Back button
    setShowBackPopup(true); // Show Back button confirmation pop-up
  };

  const handleMarkPresentConfirm = async () => {
    const [yearOfStudy, branch, section] = selectedCourse.split(" - ");
    const data = { yearOfStudy, branch, section, date };
 
    try {
      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark-remaining-present",
        data
      );
 
      console.log("Response data:", response.data);
 
      if (response.data.markedAsPresent === 0) {
        toast.info("Attendance is already marked for all students.",{
          autoClose: 800, 
        });
      } else {
        toast.success("Successfully marked remaining students as present.",{
          autoClose: 800, 
        });
      navigate("/message", {
        state: { selectedCourse, selectedDate: date },
      });
    }
 
      setShowMarkPresentPopup(false);
    } catch (error) {
      console.error("Error marking remaining students as present:", error);
      toast.error("Error marking remaining students as present. Please try again.",{
        autoClose: 800, 
      });
    }
  };

  const handleBackConfirm = () => {
    setShowBackPopup(false);
    navigate("/duty", {
      state: { selectedCourse, selectedDate: date },
    });
  };

  const handleBackCancel = () => {
    setShowBackPopup(false);
  };

  const handleConfirmationPopupOk = async () => {
    const numSelected = selectedRollNos.length;

    if (numSelected === 0) {
      toast.info("No one marked absent.",{
        autoClose: 800, 
      });
      setShowConfirmationPopup(false);
      setMarkPresentVisible(true);
    } else {
      try {
        const [yearOfStudy, branch, section] = selectedCourse.split(" - ");
        await axios.post("http://localhost:5000/api/attendance/absent", {
          rollNumbers: selectedRollNos,
          date,
          yearOfStudy,
          branch,
          section,
        });
        toast.success(`Absent marked for ${numSelected} students.`,{
          autoClose: 800, 
        });
        setShowConfirmationPopup(false);
        setSelectedRollNos([]);
        await fetchRollNumbers(selectedCourse, date);
        setMarkPresentVisible(true);
      } catch (error) {
        console.error("Error marking absentees:", error);
        toast.error("Attendance already marked. Please try again.",{
          autoClose: 800, 
        });
      }
    }
  };

  // Reusable Popup Component
  const ReusablePopup = ({
    show,
    message,
    color = "bg-gray-800", // Default color
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
  }) => {
    if (!show) return null;
  
    const popupStyles = {
      "bg-grey-800": "bg-grey-800 text-white ",
      "bg-gray-800": "bg-gray-800 text-white ", // Default fallback
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
        <div
          className={`p-8 rounded-lg shadow-lg ${
            popupStyles[color] || popupStyles["bg-gray-800"]
          }`}
        >
          <h2 className="mb-4 text-2xl font-semibold text-center">Confirm Action</h2>
          <p className="mb-6 text-center">{message}</p>
          <div className="flex justify-center space-x-6">
            {/* Confirm Button */}
            <button
              onClick={onConfirm}
              className="px-6 py-2 font-semibold text-white transition-colors bg-blue-700 rounded-md hover:bg-blue-800"
            >
              {confirmText}
            </button>
            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="px-6 py-2 font-semibold text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  
  return (
    <div className="flex flex-col items-center flex-1 p-6 md:p-8 lg:p-12">
      <div className="p-4 text-center text-black">
        <h1 className="text-4xl font-semibold">{selectedCourse}</h1>
        <h3 className="text-2xl font-semibold">Absentees Page</h3>
        <h3 className="mt-2 text-xl font-semibold">{date}</h3>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {rollNumbers.map((rollNumber, index) => (
          <div
            key={index}
            onClick={() => toggleSelection(index)}
            className={`flex items-center justify-center p-6 text-white transition-transform transform text-xl font-semibold rounded-lg cursor-pointer shadow-md
              ${rollNumber.isSelected ? "bg-blue-600" : "bg-gray-700"} hover:scale-110`}
          >
            {rollNumber.rollNo}
          </div>
        ))}
      </div>

      <div className="w-full p-4 mt-6 text-lg text-black">
  <h4 className="mb-10 text-3xl font-semibold text-center">Selected Roll Numbers:</h4>
  <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
    {selectedRollNos.map((rollNo, index) => (
      <span key={index} className="text-xl font-bold">{rollNo}</span>
    ))}
  </div>
</div>


      <div className="flex flex-col gap-4 mt-8 md:w-1/4 lg:w-1/5">
        <button
          onClick={handleConfirm}
          className="w-full px-8 py-4 text-xl font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Mark Absentees
        </button>



        {markPresentVisible && (
          <button
            onClick={() => setShowMarkPresentPopup(true)}
            className="w-full px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Mark Present
          </button>
        )}

<button
          onClick={handleBackButton}
          className="w-full px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back
        </button>
      </div>

      {/* Confirmation Pop-ups */}
      <ReusablePopup
  show={showBackPopup}
  message="Are you sure you want to go back to the Duty page?"
  color="bg-blue-600" // Popup with blue theme
  onConfirm={handleBackConfirm}
  onCancel={() => setShowBackPopup(false)}
/>

<ReusablePopup
  show={showConfirmationPopup}
  message={`${selectedRollNos.length} students will be marked absent.`} // Updated message to show number of students selected
  color="bg-red-600" // Popup with red theme for absentees
  onConfirm={handleConfirmationPopupOk}
  onCancel={() => setShowConfirmationPopup(false)}
/>


<ReusablePopup
  show={showMarkPresentPopup}
  message={`all the remaining students will be marked as present`} // Updated message to show number of students selected
  color="bg-green-600" // Popup with green theme for mark present
  onConfirm={handleMarkPresentConfirm}
  onCancel={() => setShowMarkPresentPopup(false)}
/>
      <ToastContainer />
    </div>
  );
}

export default Absentees;
