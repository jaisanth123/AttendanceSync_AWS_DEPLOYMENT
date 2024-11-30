import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SendEmail = () => {
  const [emailStatus, setEmailStatus] = useState("");
  const [file, setFile] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [toEmails, setToEmails] = useState("vikymahendiran123@gmail.com, bdvbusiness247@gmail.com,jaisanthk2006@gmail.com"); // Default emails
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendEmail = async () => {
    if (!file) {
      setEmailStatus("Please upload a file.");
      return;
    }

    setIsButtonClicked(true);

    const formData = new FormData();
    formData.append("file", file);
    const currentDate = new Date().toLocaleDateString('en-GB');
    formData.append("subject", `${currentDate} - Absentees Report`);
    formData.append("content", "Please find the attached Excel report.");
    formData.append("toEmails", toEmails); // Use the toEmails state

    try {
      const response = await fetch(
        "${import.meta.env.VITE_BACKEND_URL}/api/attendance/send-email",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmailStatus(data.message);
      } else {
        setEmailStatus("Failed to send email.");
      }
    } catch (error) {
      console.log(error);
      setEmailStatus("Error sending email.");
    } finally {
      setIsButtonClicked(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full flex-col">
      <h1 className="text-2xl font-bold mb-4">Send Email with Excel File</h1>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".xls,.xlsx"
        className="mb-4"
      />
      <input
        type="text"
        placeholder="Enter additional email addresses separated by commas"
        value={toEmails}
        onChange={(e) => setToEmails(e.target.value)} // Update state when the user adds more emails
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />
      <button
        onClick={sendEmail}
        className={`px-4 py-2 rounded text-white ${
          isButtonClicked ? "bg-blue-800" : "bg-blue-500"
        }`}
      >
        Send Email
      </button>
      {emailStatus && <p className="mt-4 text-sm">{emailStatus}</p>}

      {/* Back Button */}
      <div className="w-full max-w-md mt-4">
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="w-full px-4 py-2 font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-700 transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>

      {/* Home Button */}
      <div className="w-full max-w-md mt-4">
        <button
          onClick={() => navigate("/")} // Navigate to the home page
          className="w-full px-4 py-2 font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-700 transition-transform transform hover:scale-105"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default SendEmail;
