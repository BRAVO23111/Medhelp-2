import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useRecoilValue } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';

const Bookappointment = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
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
      fetchPatientDetails(userId);
    }
  }, []);

  const fetchPatientDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/doctors/user/${userId}`);
      setPatientName(response.data.username); // Assuming the username field contains the patient's name
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/appointment/bookappointment", {
        doctorId: actualDoctorId, // Use actualDoctorId
        patientId: patientId, 
        date: new Date(date).toISOString() 
      });
      alert("Appointment booked successfully");
      navigate('/viewappointments');
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled
          />
        </div>
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="mt-2 px-4 py-2 block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">Book Appointment</button>
      </form>
    </div>
  );
};

export default Bookappointment;
