import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

function SignIn() {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from redirecting
    
    // Authentication logic here (validate credentials)
    // Example: if credentials are correct

    // Show success toast
    toast.success("Successfully Signed In!", {
      autoClose: 2000, // Timeout for toast to disappear after 2 seconds
    });

    // Wait for 2 seconds, then navigate to the homepage
    setTimeout(() => {
      navigate("/"); // Redirect to homepage after sign-in
    }, 2000); // 2-second delay before redirecting
  };

  return (
    <div className="flex items-center justify-center h-screen transition-transform duration-1000">
      <div className="w-full max-w-md p-6 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 text-white transition-transform duration-1000 bg-gray-700 rounded-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handle email input change
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 text-white transition-transform duration-1000 bg-gray-700 rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handle password input change
            required
          />
          <button
            type="submit"
            className="w-full p-3 font-bold text-white transition-transform duration-1000 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Click here to Sign Up
          </span>
        </p>
      </div>

      {/* Toast Container to show notifications */}
      <ToastContainer />
    </div>
  );
}

export default SignIn;
