import React, { useState, useEffect } from 'react';
import api from '../config/config';

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

        const response = await api.get(`/appointment/${doctorId}/appointments`);
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

  const handleMarkAsDone = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/done`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Remove the appointment from the list
      setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
    } catch (error) {
      setError('Error marking appointment as done');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments scheduled</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {appointments.map((appointment) => (
              <div key={appointment._id} className={`rounded-lg p-6 shadow-lg transition-transform transform ${appointment.done ? 'bg-green-100 border-green-500' : 'bg-white border border-gray-300'} hover:scale-105`}>
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
                {!appointment.done && (
                  <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => handleMarkAsDone(appointment._id)}
                  >
                    Mark as Done
                  </button>
                )}
                {appointment.done && (
                  <div className="mt-4 w-full text-center text-green-600 font-semibold">
                    Appointment Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
