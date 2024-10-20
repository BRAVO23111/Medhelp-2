import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { userState } from '../atoms/Doctoratom'; 
import toast, { Toaster } from 'react-hot-toast';

// Import the config
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const setUserData = useSetRecoilState(userState);
  const navigate = useNavigate();
  const notify = () => toast('Logged in successfully');

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    const initializeUserFromStorage = () => {
      const token = window.localStorage.getItem('token');
      const userId = window.localStorage.getItem('userId');
      const userRole = window.localStorage.getItem('userRole');

      if (token && userId && userRole) {
        setUserData({
          isLoggedIn: true,
          id: userId,
          token: token,
          userRole: userRole,
        });

        // Redirect based on role
        switch (userRole) {
          case 'admin':
            navigate('/manage');
            break;
          case 'patient':
            navigate('/patientDashboard');
            break;
          case 'doctor':
            navigate('/doctordashboard');
            break;
          default:
            break;
        }
      }
    };

    initializeUserFromStorage();
  }, [setUserData, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Use the BASE_URL instead of hardcoded URL
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
        role: role 
      });
      
      const { token, userId, role: userRole } = response.data;

      // Store user data in local storage
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('userId', userId);
      window.localStorage.setItem('userRole', userRole);
      
      setUserData({
        isLoggedIn: true,
        id: userId,
        token: token,
        userRole: userRole,
      });

      notify();

      switch (userRole) {
        case 'admin':
          navigate('/manage');
          break;
        case 'patient':
          navigate('/profile');
          break;
        case 'doctor':
          navigate('/doctordashboard');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error('Login failed. Please check your credentials.');
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
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300">Login</button>
      </form>
      <p className="mt-4 text-center text-sm">Don't have an account? <Link to="/register" className="text-indigo-500 font-medium hover:text-indigo-600">Register</Link></p>
      <Toaster />
    </div>
  );
};

export default Login;