import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Button } from "./ui/button";
import api from '../config/config';

const Bookappointment = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState('');

  const { doctorId } = useParams();
  const selectedDoctorId = useRecoilValue(selectedDoctorIdState);
  const actualDoctorId = selectedDoctorId || doctorId;
  const navigate = useNavigate();

  useEffect(() => {
    const userId = window.localStorage.getItem('userId');
    if (userId) {
      setPatientId(userId);
      fetchPatientDetails();
    }
  }, []);

  const fetchPatientDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profile/get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.name) {
        setPatientName(response.data.name);
      } else {
        setError("Profile information not found");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.message || "Error fetching patient details. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await api.post("/appointment/bookappointment", 
        {
          doctorId: actualDoctorId,
          patientId: patientId,
          date: new Date(`${date}T${time}`).toISOString(),
          time: time,
          reason: reason
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      setTimeout(() => navigate('/viewappointments'), 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Book Appointment</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Success</p>
          <p>Appointment booked successfully. Redirecting...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600"
            disabled
          />
        </div>
        
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600"
            disabled
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-600"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          variant="default"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </div>
  );
};

export default Bookappointment;