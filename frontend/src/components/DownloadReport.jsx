import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS

const DownloadReport = () => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [message, setMessage] = useState(''); // State to hold message when no students are absent
  const [date, setDate] = useState(''); // State to store selected date
  const [gender, setGender] = useState('ALL'); // State to store selected gender (default 'MALE')
  const [hostellerDayScholar, setHostellerDayScholar] = useState('ALL'); // State to store hostellerDayScholar selection
  const [yearOfStudy, setYearOfStudy] = useState('ALL'); // State to store selected year of study
  const [section, setSection] = useState('ALL'); // State to store selected section (default 'ALL')
  const [branch, setBranch] = useState('ALL'); // State to store selected branch (default 'ALL')

  // Handle the date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle the gender change
  const handleGenderChange = (e) => {
    setGender(e.target.value.toUpperCase()); // Ensure gender is always in uppercase
  };

  // Handle the hostellerDayScholar change
  const handleHostellerDayScholarChange = (e) => {
    setHostellerDayScholar(e.target.value);
  };

  // Handle the yearOfStudy change
  const handleYearOfStudyChange = (e) => {
    setYearOfStudy(e.target.value);
  };

  // Handle the section change
  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  // Handle the branch change
  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  // Function to format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle the button click to download the report
  const handleDownload = () => {
    if (!date) {
      // Show toast message for missing date selection
      toast.info('Please select a date.', { autoClose: 800 });
      return;
    }

    setIsLoading(true);
    setMessage(''); // Reset previous message

    // Construct the URL with gender, hostellerDayScholar, date, yearOfStudy, section, and branch parameters
    const url = `http://localhost:5000/api/report/download-absent-report?gender=${gender}&date=${date}&hostellerDayScholar=${hostellerDayScholar}&yearOfStudy=${yearOfStudy}&section=${section}&branch=${branch}`;

    // Fetch the report from the server
    fetch(url)
      .then((response) => {
        if (response.status === 404) {
          // If no absent students, set message and show toast for no absent students
          return response.json().then((data) => {
            const formattedDate = formatDate(date); // Format the date
            setMessage(`No absent students found for specified criteria on ${formattedDate}.`);
            setIsLoading(false);
            toast.info(`No absent students found for specified criteria on ${formattedDate}.`, { autoClose: 2000 });
          });
        } else if (response.ok) {
          // If response is a file, trigger the download
          return response.blob().then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Absent_Students_Report.xlsx'; // Set file name
            link.click();
            setIsLoading(false);

            // Show success toast notification after file download
            toast.success('Report downloaded successfully!', { autoClose: 2000 });
          });
        } else {
          throw new Error('Something went wrong with the report generation');
        }
      })
      .catch((error) => {
        console.error('Error generating report:', error);
        toast.error('An error occurred while generating the report.', { autoClose: 2000 });
        setIsLoading(false); // Set loading to false if error occurs
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg sm:w-96 md:w-80 lg:w-96 xl:w-1/3">
        <h2 className="mb-6 text-2xl font-semibold text-center text-white">Download Absentee Report</h2>

        {/* Date input field */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-white text-gray-700">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Gender dropdown */}
        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-white">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={handleGenderChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MALE">BOYS</option>
            <option value="FEMALE">GIRLS</option>
            <option value="ALL">ALL</option> {/* Option for ALL */}
          </select>
        </div>

        {/* Hosteller/Day Scholar dropdown */}
        <div className="mb-4">
          <label htmlFor="hostellerDayScholar" className="block text-sm font-medium text-white">Hostel Type:</label>
          <select
            id="hostellerDayScholar"
            value={hostellerDayScholar}
            onChange={handleHostellerDayScholarChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="HOSTELLER">HOSTELLER</option>
            <option value="DAY SCHOLAR">DAY SCHOLAR</option>
          </select>
        </div>

        {/* Year of Study dropdown */}
        <div className="mb-4">
          <label htmlFor="yearOfStudy" className="block text-sm font-medium text-white">Year of Study:</label>
          <select
            id="yearOfStudy"
            value={yearOfStudy}
            onChange={handleYearOfStudyChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="II">Second Year</option>
            <option value="III">Third Year</option>
            <option value="IV">Fourth Year</option>
          </select>
        </div>

        {/* Branch dropdown */}
        <div className="mb-4">
          <label htmlFor="branch" className="block text-sm font-medium text-white">Branch:</label>
          <select
            id="branch"
            value={branch}
            onChange={handleBranchChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="AIML">ML</option>
            <option value="AIDS">DS</option>
          </select>
        </div>

        {/* Section dropdown */}
        <div className="mb-6">
          <label htmlFor="section" className="block text-sm font-medium text-white">Section:</label>
          <select
            id="section"
            value={section}
            onChange={handleSectionChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">ALL</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        {/* Button to trigger report download */}
        <button
          onClick={handleDownload}
          className="w-full px-4 py-2 font-bold text-white transition duration-300 bg-blue-600 rounded-md shadow hover:bg-blue-700"
        >
          {isLoading ? 'Loading...' : 'Download Report'}
        </button>

        {/* Display message if no students are absent */}
        {message && (
          <p className="mt-4 text-center text-white">{message}</p>
        )}
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default DownloadReport;
