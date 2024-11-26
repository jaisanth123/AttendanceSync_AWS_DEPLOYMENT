import React, { useState } from 'react';

const SendEmail = () => {
  const [emailStatus, setEmailStatus] = useState("");
  const [file, setFile] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false); 

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
    formData.append("subject", "Daily Report");
    formData.append("content", "Please find the attached Excel report.");
    formData.append("toEmails", "vikymahendiran123@gmail.com");

    try {
      const response = await fetch("http://localhost:5000/api/attendance/send-email", {
        method: "POST",
        body: formData,
      });

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
      <button
        onClick={sendEmail}
        className={`px-4 py-2 rounded text-white ${
          isButtonClicked ? "bg-blue-700" : "bg-blue-500"
        }`}
      >
        Send Email
      </button>
      {emailStatus && <p className="mt-4 text-sm">{emailStatus}</p>}
    </div>
  );
};

export default SendEmail;
