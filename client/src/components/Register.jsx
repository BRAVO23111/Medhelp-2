import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // Default role is 'patient'
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(role);
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username: username,
        password: password,
        role: role // Include the selected role in the registration request
      });
      alert("Registered successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-semibold">Role:</label>
          <select
  id="role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
>
  <option value="patient">patient</option>
  <option value="doctor">doctor</option>
  <option value="admin">admin</option>
</select>

        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300">Register</button>
      </form>
      <p className="mt-4">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
};

export default Register;
