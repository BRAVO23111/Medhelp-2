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
        const currentAppointments = response.data.filter(appointment => new Date(appointment.date) >= new Date());
        setAppointments(currentAppointments);
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
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Appointments</h2>
      {appointments && appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments scheduled</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border rounded-lg p-4 shadow-lg bg-white">
              <h3 className="text-xl font-semibold mb-2">Doctor: {appointment.doctor.username}</h3>
              <p className="text-gray-600 mb-1"><strong>Speciality:</strong> {appointment.doctor.speciality}</p>
              <p className="text-gray-600 mb-1"><strong>Patient:</strong> {appointment.patient.username}</p>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;
