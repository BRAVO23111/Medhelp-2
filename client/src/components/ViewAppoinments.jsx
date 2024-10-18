import React, { useState, useEffect } from 'react';
import { FaUserMd, FaUser } from 'react-icons/fa';
import { BsCalendarEvent, BsClock } from 'react-icons/bs';
import { MdOutlineVerified } from 'react-icons/md';

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://medhelp-2.onrender.com/appointment/user/appointments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        const currentAppointments = data.filter(appointment => 
          new Date(appointment.date) >= new Date()
        );
        setAppointments(currentAppointments);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 relative animate-spin">
          <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 flex items-center space-x-2">
            <span className="text-lg font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Your Appointments
          </h1>
          <p className="text-gray-600">
            Manage your upcoming medical consultations
          </p>
        </div>

        {/* Appointments Grid */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4">
              <BsCalendarEvent className="w-12 h-12 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-900">No Appointments</h3>
              <p className="text-gray-500">You don't have any upcoming appointments scheduled.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment, index) => (
              <div 
                key={appointment._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-out forwards'
                }}
              >
                {/* Appointment Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaUserMd className="w-6 h-6 text-white" />
                      <span className="text-lg font-semibold text-white">
                        {appointment.doctor.username}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-blue-500 bg-opacity-30 rounded-full">
                      <span className="text-sm font-medium text-white">
                        {appointment.doctor.speciality}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    <BsCalendarEvent className="w-5 h-5 text-blue-500" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    <BsClock className="w-5 h-5 text-blue-500" />
                    <span>{formatTime(appointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    <FaUser className="w-5 h-5 text-blue-500" />
                    <span>Patient: {appointment.patient.username}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-full">
                        <MdOutlineVerified className="w-4 h-4" />
                        <span className="text-sm font-medium">Confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ViewAppointment;