import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom.js';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("userId"));
  const [user, setUser] = useState(null); // New state to store user details
  const navigate = useNavigate(); 
  const [selectedDoctorId, setSelectedDoctorId] = useRecoilState(selectedDoctorIdState);
  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
          const userId = window.localStorage.getItem("userId");
          const response = await axios.get(`http://localhost:3000/doctors/user/${userId}`, {
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
          const response = await axios.get("http://localhost:3000/doctors", {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
          });
          setDoctors(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      

    fetchDoctors();
  }, []);

  const bookAppointment = async (doctorId) => {
    try {
      setSelectedDoctorId(doctorId); // Set the selected doctor ID using Recoil
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
        case 'patient':
          navigate('/');
          break;
        case 'doctor':
          navigate('/doctordashboard');
          break;
        default:
          // Handle other roles or no role
          break;
      }
    }
  }, [user, navigate]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8">Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hi {user ? user.username : ''}, these are the doctors available</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id} className="border-b border-gray-200 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{doctor.username}</h3>
              <p className="text-gray-600">{doctor.speciality}</p>
            </div>
            {isLoggedIn && (
              <button onClick={() => bookAppointment(doctor._id)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Book Now</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
