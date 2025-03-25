import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';
import { motion } from 'framer-motion';
import { FaSearch, FaUserMd, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import api from '../config/config';
import { Button } from "./ui/button";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("userId"));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Any Time');
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
        console.log(response.data);
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
      navigate(`/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error navigating to doctor details:", error);
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
    let filtered = doctors;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter(doctor =>
        doctor.speciality === selectedSpecialty
      );
    }
    
    // In a real app, we would filter by time slot as well
    // This is a placeholder for demonstration purposes
    
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, selectedTimeSlot, doctors]);

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

  // Helper function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="relative">
          <FaStar className="text-gray-300" />
          <span className="absolute top-0 left-0 overflow-hidden w-1/2">
            <FaStar className="text-yellow-400" />
          </span>
        </span>
      );
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  // Get unique specialties for filter dropdown
  const specialties = ['All Specialties', ...new Set(doctors.map(doctor => doctor.speciality))];
  
  // Time slots for filter dropdown
  const timeSlots = ['Any Time', 'Morning', 'Afternoon', 'Evening'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Available Doctors Today
        </h2>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Find and book appointments with qualified healthcare professionals
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          {filteredDoctors.map((doctor) => {
            // Generate random rating and reviews for demo purposes
            const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
            const reviews = Math.floor(Math.random() * (200 - 50) + 50);
            const availableHours = `${8 + Math.floor(Math.random() * 4)}:00 AM - ${2 + Math.floor(Math.random() * 6)}:00 PM`;
            const location = ['Medical Center, Floor 3', 'Dermatology Clinic, Tower B', 'Children\'s Wing, Building C'][Math.floor(Math.random() * 3)];
            const experience = `${5 + Math.floor(Math.random() * 15)}+ Years Exp.`;
            const specialty = doctor.speciality.toLowerCase().includes('specialist') ? doctor.speciality : `${doctor.speciality} Specialist`;
            
            return (
              <motion.div
                key={doctor._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                      <img src="https://i.postimg.cc/KjbvHv8F/asset1.jpg" alt={doctor.username} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{doctor.username}</h3>
                      <p className="text-blue-600">{doctor.speciality}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {renderStarRating(parseFloat(rating))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{rating} ({reviews} reviews)</span>
                  </div>
                  
                  <div className="mb-3 flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>Available today: {availableHours}</span>
                  </div>
                  
                  <div className="mb-4 flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{location}</span>
                  </div>
                  
                  <div className="flex mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      {specialty}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {experience}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => bookAppointment(doctor._id)}
                    variant="default"
                    className="w-full"
                  >
                    Book Appointment
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorList;