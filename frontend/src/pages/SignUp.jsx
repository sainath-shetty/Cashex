import React, { useState } from 'react';
import { BottomWarning, ButtonComponent, Heading, InputBox, SubHeading } from '../assets/RequiredCompo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../apiConfig';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(""); // Reset error message

    // Validate inputs
    if (!username || !password || !firstName || !lastName) {
      setError("Please fill all the required fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // Sending sign-up request
      const response = await axios.post(`${API_BASE}/api/v1/user/signup`, {
        username,
        firstName,
        lastName,
        password,
      });

      // Save token to sessionStorage (per-tab, so multiple users can be open in different tabs)
      sessionStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with an error
        const backendMessage = error.response.data.message || "An unexpected error occurred.";
        const detailedErrors = error.response.data.errors;

        if (detailedErrors) {
          setError(detailedErrors.map(err => `${err.path.join('.')} - ${err.message}`).join(', '));
        } else {
          setError(backendMessage);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("No response received from the server.");
      } else {
        // Something else went wrong
        setError("An error occurred while sending the request.");
      }
    }
  };

  return (
    <div className='flex justify-center overflow-hidden'>
      <div className="bg-white flex flex-col w-[400px] h-[540px] justify-center p-6 rounded-lg shadow-lg">
        <Heading label="Sign Up" />
        <SubHeading label="You can enter your details and sign up" />

        <InputBox
          onChange={(e) => setFirstname(e.target.value)}
          label="First Name"
          placeholder="Enter your name here"
        />
        <InputBox
          onChange={(e) => setLastname(e.target.value)}
          label="Last Name"
          placeholder="Enter your last name here"
        />
        <InputBox
          onChange={(e) => setUsername(e.target.value)}
          label="Email Address"
          placeholder="Enter your email here"
        />
        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Enter password"
          type={showPassword ? 'text' : 'password'}
          rightElement={
            <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-500 hover:text-gray-800 focus:outline-none">
              {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          }
        />

        <ButtonComponent onClick={handleSignUp} label="Sign Up" />
        <BottomWarning label="Already have an Account?" buttonText="SignIn" to="/signin" />
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
