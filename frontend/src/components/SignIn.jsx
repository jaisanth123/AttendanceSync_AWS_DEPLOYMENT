import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

function SignIn() {
  const navigate = useNavigate();

  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user'

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from redirecting

    try {
      // Create the payload based on role
      const payload = {
        username,
        password,
      };

      // Send login request based on role
      let response;
      if (role === "user") {
        response = await axios.post("http://localhost:5000/api/auth/login/user", payload);
      } else {
        response = await axios.post("http://localhost:5000/api/auth/login/admin", payload);
      }

      // Save the token in sessionStorage
      const token = response.data.token;
      sessionStorage.setItem("authToken", token); // Store token in sessionStorage

      // Show success toast
      toast.success(response.data.message, {
        autoClose: 2000, // Timeout for toast to disappear after 2 seconds
      });

      // Wait for 2 seconds, then navigate to the homepage
      setTimeout(() => {
        navigate("/homePage"); // Redirect to homepage after sign-in
      }, 2000);
    } catch (error) {
      // Show error toast if authentication fails
      toast.error(error.response?.data?.message || "Login failed. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen transition-transform duration-1000">
      <div className="w-full max-w-md p-6 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 text-white transition-transform duration-1000 bg-gray-700 rounded-lg focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Handle username input change
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
          <div>
            <label className="block text-white">Role</label>
            <select
              className="w-full p-3 text-white bg-gray-700 rounded-lg focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)} // Handle role selection change
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 font-bold text-white transition-transform duration-1000 bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Toast Container to show notifications */}
      <ToastContainer />
    </div>
  );
}

export default SignIn;
