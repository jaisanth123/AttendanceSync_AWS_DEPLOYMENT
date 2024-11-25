// SignInSignUp.jsx
import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-black">
      <div className="relative w-[90%] max-w-lg h-[600px] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {/* Switch Between SignIn and SignUp */}
        <div className={`transition-all duration-500 ${isSignUp ? 'rotate-180' : ''}`}>
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg">
            {!isSignUp ? <SignIn /> : <SignUp />}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="absolute px-6 py-3 text-lg text-white bg-transparent border-2 border-white rounded-lg bottom-6 hover:bg-white hover:text-gray-900"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInSignUp;
