import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedDoctorIdState } from '../atoms/Doctoratom';
import Navbar from './Navbar'; // Import Navbar component

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // New state to store user details
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem("userId"));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedDoctorId, setSelectedDoctorId] = useRecoilState(selectedDoctorIdState);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = window.localStorage.getItem("userId");
        const response = await axios.get(`https://medhelp-2.onrender.com/doctors/user/${userId}`, {
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
        setFilteredDoctors(response.data); // Initialize filteredDoctors with all doctors
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchDoctors();
  }, [isLoggedIn]); // Fetch data whenever the isLoggedIn state changes

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
          // Do nothing if the user is a patient
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
    // Filter doctors based on the search term
    setFilteredDoctors(
      doctors.filter(doctor =>
        doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, doctors]);

  if (!isLoggedIn || (user && user.role !== 'patient')) {
    // Redirect to login or show message if the user is not logged in or not a patient
    return <div className="text-center mt-8">Please login to view this page.</div>;
  }

  if (loading) return (
    <div className="text-center mt-8">
      <button disabled type="button" className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
        </svg>
        Loading...
      </button>
    </div>
  );

  if (error) return <div className="text-center mt-8">Error: {error}</div>;

  return (
    <div>
      {/* <Navbar isLoggedIn={isLoggedIn} setUser={setUser} /> */}
      <div className="container mx-auto mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Hi {user ? user.username : ''}, these are the doctors available</h2>
        
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="border rounded-lg p-6 shadow-lg bg-white">
              <div className="flex flex-col items-center">
                <img src="https://i.postimg.cc/KjbvHv8F/asset1.jpg" alt={doctor.username} className="w-24 h-24 rounded-full mb-4" />
                <h3 className="text-lg font-semibold mb-2">{doctor.username}</h3>
                <p className="text-gray-600 mb-2">{doctor.speciality}</p>
              </div>
              {isLoggedIn && (
               <button
               onClick={() => bookAppointment(doctor._id)}
               className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center transition-all duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
             >
               Book Now →
             </button>
              
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
