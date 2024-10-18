import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const doctorId = window.localStorage.getItem('userId');

        if (!doctorId) {
          setError('No doctor logged in');
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://medhelp-2.onrender.com/appointment/${doctorId}/appointments`);
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments scheduled</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border rounded-lg p-6 shadow-lg bg-white">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Patient: {appointment.patient ? appointment.patient.username : 'Unknown'}
                </h3>
              </div>
              <div className="text-gray-600 mb-2">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div className="text-gray-600 mb-2">
                <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString()}
              </div>
              <div className="text-gray-600 mb-2">
                <strong>Reason:</strong> {appointment.reason}
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
