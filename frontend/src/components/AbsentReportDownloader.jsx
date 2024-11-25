import React, { useState } from 'react';

const AbsentReportDownloader = () => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [message, setMessage] = useState(''); // State to hold message when no students are absent
  const [date, setDate] = useState(''); // State to store selected date
  const [gender, setGender] = useState('MALE'); // State to store selected gender (default 'MALE')

  // Handle the date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle the gender change
  const handleGenderChange = (e) => {
    setGender(e.target.value.toUpperCase()); // Ensure gender is always in uppercase
  };

  // Handle the button click to download the report
  const handleDownload = () => {
    if (!date) {
      setMessage('Please select a date.');
      return;
    }

    setIsLoading(true);
    setMessage(''); // Reset previous message

    // Construct the URL with the gender and date parameters
    const url = `http://localhost:5000/api/report/reportabsent/${gender.toLowerCase()}?date=${date}`;

    // Fetch the report from the server
    fetch(url)
      .then((response) => {
        if (response.status === 404) {
          // If no absent students, show the message
          return response.json().then((data) => {
            setMessage(data.message || 'No students absent on this date.');
            setIsLoading(false);
          });
        } else if (response.ok) {
          // If response is a file, trigger the download
          return response.blob().then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Absent_Students_Report.xlsx'; // Set file name
            link.click();
            setIsLoading(false);
          });
        } else {
          throw new Error('Something went wrong with the report generation');
        }
      })
      .catch((error) => {
        console.error('Error generating report:', error);
        setMessage('An error occurred while generating the report.');
        setIsLoading(false); // Set loading to false if error occurs
      });
  };

  return (
    <div>
      {/* Date input field */}
      <div>
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          style={{ padding: '5px', margin: '10px 0' }}
        />
      </div>

      {/* Gender dropdown */}
      <div>
        <label htmlFor="gender">Select Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={handleGenderChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {/* Button to trigger report download */}
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? 'Generating Report...' : 'Download Report'}
      </button>

      {/* Message display if no absent students */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AbsentReportDownloader;
