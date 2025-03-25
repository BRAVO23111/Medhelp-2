import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaClock, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { Button } from "./ui/button";
import api from '../config/config';

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await api.get(`/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        });
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError(error.message || "Failed to load doctor details");
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  const handleBookAppointment = () => {
    navigate(`/bookappointment/${doctorId}`);
  };

  const handleGoBack = () => {
    navigate('/bookappointment');
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleGoBack} className="mt-4">
            <FaArrowLeft className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
          <p className="text-gray-600">The doctor you're looking for could not be found.</p>
          <Button onClick={handleGoBack} className="mt-4">
            <FaArrowLeft className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Generate random data for demo purposes
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
  const reviews = Math.floor(Math.random() * (200 - 50) + 50);
  const availableHours = `${8 + Math.floor(Math.random() * 4)}:00 AM - ${2 + Math.floor(Math.random() * 6)}:00 PM`;
  const location = ['Medical Center, Floor 3', 'Dermatology Clinic, Tower B', 'Children\'s Wing, Building C'][Math.floor(Math.random() * 3)];
  const experience = `${5 + Math.floor(Math.random() * 15)}+ Years Experience`;
  const specialty = doctor.speciality.toLowerCase().includes('specialist') ? doctor.speciality : `${doctor.speciality} Specialist`;
  
  // Sample education and bio data
  const education = [
    'MD, Harvard Medical School',
    'Residency, Johns Hopkins Hospital',
    'Fellowship, Mayo Clinic'
  ];
  
  const bio = "Dr. " + doctor.username + " is a highly skilled and compassionate " + doctor.speciality + " with over a decade of experience in treating patients with various conditions. They are dedicated to providing personalized care and helping patients achieve optimal health outcomes. Their approach combines the latest medical advancements with a focus on patient education and preventive care.";
  
  // Note: We're keeping these dummy values for bio, ratings, and reviews as they are not in the backend

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Doctors
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Doctor Header Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full overflow-hidden mr-6 mb-4 md:mb-0 flex-shrink-0">
                <img src="https://i.postimg.cc/KjbvHv8F/asset1.jpg" alt={doctor.username} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{doctor.username}</h1>
                <p className="text-lg text-blue-600 font-medium">{specialty}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {renderStarRating(parseFloat(rating))}
                  </div>
                  <span className="text-gray-600">{rating} ({reviews} reviews)</span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {specialty}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {experience}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Doctor Info Section */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Contact & Availability */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Availability</h3>
                <div className="flex items-start text-gray-600 mb-2">
                  <FaClock className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="font-medium">Today</p>
                    <p>{availableHours}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="flex items-start text-gray-600">
                  <FaMapMarkerAlt className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="font-medium">Office</p>
                    <p>{location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Education</h3>
                <ul className="space-y-2">
                  {education.map((edu, index) => (
                    <li key={index} className="text-gray-600">{edu}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Right Column - Bio & Book Button */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About {doctor.username}</h3>
                <p className="text-gray-600">{bio}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Book an Appointment</h3>
                <p className="text-gray-600 mb-4">Select a convenient time to meet with Dr. {doctor.username}.</p>
                
                <Button
                  onClick={handleBookAppointment}
                  className="w-full flex items-center justify-center"
                  size="lg"
                >
                  <FaCalendarAlt className="mr-2" /> Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorDetails;