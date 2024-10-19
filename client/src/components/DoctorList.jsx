import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';
import { motion } from 'framer-motion';
import { FaSearch, FaUserMd } from 'react-icons/fa';
import api from '../config/config';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("userId"));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedDoctorId, setSelectedDoctorId] = useRecoilState(selectedDoctorIdState);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = window.localStorage.getItem("userId");
        const response = await api.get(`/doctors/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchDoctors();
  }, [isLoggedIn]);

  const bookAppointment = async (doctorId) => {
    try {
      setSelectedDoctorId(doctorId);
      navigate(`/bookappointment/${doctorId}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admindashboard');
          break;
        case 'doctor':
          navigate('/doctordashboard');
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter(doctor =>
        doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, doctors]);

  if (!isLoggedIn || (user && user.role !== 'patient')) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-screen bg-gray-100"
      >
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FaUserMd className="text-6xl text-blue-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-gray-600">Please login as a patient to view this page.</p>
        </div>
      </motion.div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
      ></motion.div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Welcome, {user ? user.username : 'Patient'}
        </h2>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Find and book appointments with our qualified doctors
        </p>
        
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <img src="https://i.postimg.cc/KjbvHv8F/asset1.jpg" alt={doctor.username} className="w-24 h-24 rounded-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{doctor.username}</h3>
                <p className="text-gray-600 mb-4 text-center">{doctor.speciality}</p>
                <button
                  onClick={() => bookAppointment(doctor._id)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorList;