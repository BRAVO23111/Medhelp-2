import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [speciality, setSpeciality] = useState('');
    const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Retrieve token from local storage
      const token = window.localStorage.getItem("token");

      // Send the request to register a new doctor with authorization header
      const response = await axios.post(' http://localhost:3000/doctors/registerdoctor', {
        username: username,
        password: password,
        speciality: speciality,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in the Authorization header
        }
      });
      alert("added");
      navigate('/manage')
      console.log(response.data);
      // Optionally, you can handle success response
    } catch (error) {
      console.error('Error adding doctor:', error);
      // Optionally, you can handle error response
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Add Doctor</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="speciality" className="block text-gray-700 text-sm font-bold mb-2">Speciality</label>
          <input type="text" id="speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
