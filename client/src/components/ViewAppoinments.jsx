import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = window.localStorage.getItem('userId');
        const response = await axios.get(`https://medhelp-2.onrender.com/appointment/user/${userId}/appointments`);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments scheduled</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id} className="border-b border-gray-200 py-4">
              <div>
                <p className="text-lg font-semibold">Doctor: {appointment.doctor.username}</p>
                <p className="text-gray-600">Speciality: {appointment.doctor.speciality}</p>
                <p className="text-gray-600">Date: {appointment.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewAppointment;
