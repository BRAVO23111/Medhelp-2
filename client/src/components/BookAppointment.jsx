import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useRecoilValue } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';

const Bookappointment = () => {
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');

  // Get doctorId from URL parameter
  const { doctorId } = useParams();
  
  // Use Recoil to get selected doctorId
  const selectedDoctorId = useRecoilValue(selectedDoctorIdState);
  
  // doctorId from Recoil state will override the one from URL if available
  const actualDoctorId = selectedDoctorId || doctorId;
    const navigate = useNavigate();
  useEffect(() => {
    const userId = window.localStorage.getItem('userId');
    if (userId) {
      setPatientId(userId);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://medhelp-2.onrender.com/appointment/bookappointment", {
        doctorId: actualDoctorId, // Use actualDoctorId
        patientId: patientId, 
        date: new Date(date).toISOString() 
      });
      alert("Appointment booked successfully");
      navigate('/viewappointments')
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 px-4 py-2 block w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300">Book Appointment</button>
      </form>
    </div>
  );
};

export default Bookappointment;
