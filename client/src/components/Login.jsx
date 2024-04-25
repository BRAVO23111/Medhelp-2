import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://medhelp-2.onrender.com/auth/login", {
        username: username,
        password: password,
        role: role
      });
      console.log(response.data.role);
      const { token, userId, role: userRole } = response.data;

      // Store user role in local storage for future use
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("userId", userId);
      window.localStorage.setItem("userRole", userRole);

      // Redirect based on user role
      switch (userRole) {
        case 'admin':
          navigate('/admindashboard');
          break;
        case 'patient':
          navigate('/');
          break;
        case 'doctor':
          navigate('/doctordashboard');
          break;
        default:
          // Handle other roles or no role
          break;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="patient">patient</option>
            <option value="doctor">doctor</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300">Login</button>
      </form>
      <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-indigo-500 font-medium hover:text-indigo-600">Register</Link></p>
    </div>
  );
};

export default Login;
