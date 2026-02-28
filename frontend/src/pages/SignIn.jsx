import React, { useState } from 'react';
import { BottomWarning, ButtonComponent, Heading, InputBox, SubHeading } from '../assets/RequiredCompo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../apiConfig';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    setError(''); // Clear previous errors
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {

      const response = await axios.post(`${API_BASE}/api/v1/user/signin`, {
        username,
        password,
      });

      // Store token in sessionStorage (per-tab, so multiple users can be open in different tabs)
      sessionStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      // Extract meaningful error message
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Backend-provided error message
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="bg-white flex flex-col w-[500px] h-[390px] justify-center p-6 rounded-lg shadow-lg">
        <Heading label="Sign In" />
        <SubHeading label="You can enter your details and sign in" />
        <InputBox
          onChange={(e) => setUsername(e.target.value)}
          label="Email Address"
          placeholder="Enter your email here"
        />
        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Enter your password here"
          type={showPassword ? 'text' : 'password'}
          rightElement={
            <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-500 hover:text-gray-800 focus:outline-none">
              {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
            </button>
          }
        />
        <ButtonComponent onClick={handleSignIn} label="Sign In" />
        <BottomWarning label="Create a new Account? " buttonText="SignUp" to="/signup" />
        {/* Conditionally display the error message */}
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
