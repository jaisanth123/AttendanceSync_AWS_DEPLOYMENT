import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GenerateMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState([]);
  const [missingStudents, setMissingStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCard, setShowCard] = useState(false);

  const [date, setDate] = useState('');
  const [gender, setGender] = useState('ALL');
  const [hostellerDayScholar, setHostellerDayScholar] = useState('ALL');
  const [yearOfStudy, setYearOfStudy] = useState('ALL');
  const [section, setSection] = useState('ALL');
  const [branch, setBranch] = useState('ALL');

  const handleDateChange = (e) => setDate(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value.toUpperCase());
  const handleHostellerDayScholarChange = (e) => setHostellerDayScholar(e.target.value);
  const handleYearOfStudyChange = (e) => setYearOfStudy(e.target.value);
  const handleSectionChange = (e) => setSection(e.target.value);
  const handleBranchChange = (e) => setBranch(e.target.value);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const copyCardContent = () => {
    const cardContent = document.getElementById('cardContent');
    const range = document.createRange();
    range.selectNodeContents(cardContent);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand('copy');
      toast.info('Content copied to clipboard!', { autoClose: 800 });
    } catch (err) {
      toast.error('Failed to copy content!', { autoClose: 800 });
    }
    selection.removeAllRanges();
  };

  const toggleCardVisibility = () => {
    setShowCard(!showCard);
  };

  const handleDownload = () => {
    if (!date) {
      toast.info('Please select a date.', { autoClose: 800 });
      return;
    }

    setIsLoading(true);
    setMessage('');
    setDetails([]);
    setMissingStudents([]);
    setErrorMessage('');

    const url = `http://localhost:5000/api/report/absentStudentsCustom?gender=${gender}&date=${date}&hostellerDayScholar=${hostellerDayScholar}&yearOfStudy=${yearOfStudy}&section=${section}&branch=${branch}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          const detailsArray = data.details ? data.details.split('\n') : [];
          setDetails(detailsArray);
          setMissingStudents(data.missingStudents || []);
          setErrorMessage('');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
        setIsLoading(false);
      });
  };

  return (
    <div>
      {/* Date input field */}
      <div>
        <label htmlFor="date">Date:</label>
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
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={handleGenderChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="MALE">BOYS</option>
          <option value="FEMALE">GIRLS</option>
          <option value="ALL">ALL</option>
        </select>
      </div>

      {/* Hosteller/Day Scholar dropdown */}
      <div>
        <label htmlFor="hostellerDayScholar">Hostel Type:</label>
        <select
          id="hostellerDayScholar"
          value={hostellerDayScholar}
          onChange={handleHostellerDayScholarChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="ALL">ALL</option>
          <option value="HOSTELLER">HOSTELLER</option>
          <option value="DAY SCHOLAR">DAY SCHOLAR</option>
        </select>
      </div>

      {/* Year of Study dropdown */}
      <div>
        <label htmlFor="yearOfStudy">Year of Study:</label>
        <select
          id="yearOfStudy"
          value={yearOfStudy}
          onChange={handleYearOfStudyChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="ALL">ALL</option>
          <option value="II">Second Year</option>
          <option value="III">Third Year</option>
          <option value="IV">Fourth Year</option>
        </select>
      </div>

      {/* Branch dropdown */}
      <div>
        <label htmlFor="branch">Branch:</label>
        <select
          id="branch"
          value={branch}
          onChange={handleBranchChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="ALL">ALL</option>
          <option value="AIML">ML</option>
          <option value="AIDS">DS</option>
        </select>
      </div>

      {/* Section dropdown */}
      <div>
        <label htmlFor="section">Section:</label>
        <select
          id="section"
          value={section}
          onChange={handleSectionChange}
          style={{ padding: '5px', margin: '10px 0' }}
        >
          <option value="ALL">ALL</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>

      {/* Button to trigger report download */}
      <button
        onClick={() => {
          handleDownload();
          toggleCardVisibility();
        }}
        className="w-full px-6 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-lg sm:w-64 md:w-64 hover:bg-blue-700"
      >
        {isLoading ? 'Generating Report...' : 'Get Absent Students'}
      </button>

      {/* Display card with message and details */}
      {showCard && (message || details.length > 0 || missingStudents.length > 0 || errorMessage) && (
        <div className="w-full p-6 mt-6 text-gray-200 bg-gray-700 rounded-lg shadow-lg">
          <div id="cardContent">
            {message && (
              <p
                className="font-semibold"
                dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />') }}
              />
            )}

            {details.length > 0 && (
              <ul className="mt-2 space-y-2 text-white list-none">
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}

            {missingStudents.length > 0 && (
              <p className="mt-4">Missing Absentees: {missingStudents.length}</p>
            )}

            {errorMessage && (
              <div className="p-3 mt-4 text-red-400 bg-red-800 rounded">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Copy content button */}
          <button
            onClick={copyCardContent}
            className="px-4 py-2 mt-4 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Copy Content
          </button>
        </div>
      )}

      {/* ToastContainer to render toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default GenerateMessage;
