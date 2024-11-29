import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  // Function to handle the "Go Back" button click
  const goBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-2xl font-bold text-red-600">
      <h1>404 - Page Not Found</h1>
      <button
        onClick={goBack}
        className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound;
