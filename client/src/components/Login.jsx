import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { userState } from '../atoms/Doctoratom';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "./ui/button";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const setUserData = useSetRecoilState(userState);
  const navigate = useNavigate();
  const notify = () => toast.success('Logged in successfully');

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
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
        role: role 
      });
      
      const { token, userId, role: userRole } = response.data;

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full" variant="default">
            Log In
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-indigo-500 font-medium hover:text-indigo-600">Register</Link></p>
        <Toaster />
      </div>
    </div>
  );
};

export default Login;
