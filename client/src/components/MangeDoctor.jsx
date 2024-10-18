import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filter, setFilter] = useState(null);

  // Define the fetchDoctors function outside of the useEffect hook
  const fetchDoctors = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }
      
      const response = await axios.get("https://medhelp-2.onrender.com/doctors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.log('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    // Initial fetch of doctors
    fetchDoctors();
  }, []);

  // Function to handle removal of a doctor
  const handleRemoveDoctor = async (doctorId) => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }

      // Delete the doctor from the server
      await axios.delete(`https://medhelp-2.onrender.com/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the list of doctors by refetching
      fetchDoctors();
    } catch (error) {
      console.log('Error removing doctor:', error);
    }
  };

  // Function to apply filters
  const applyFilter = (type) => {
    setFilter(type);
    if (type === 'Cardio') {
      setFilteredDoctors(doctors.filter(doctor => doctor.speciality === 'Cardio'));
    } else if (type === 'General') {
      setFilteredDoctors(doctors.filter(doctor => doctor.speciality === 'General'));
    } else {
      setFilteredDoctors(doctors);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Doctors</h2>
      <div className="flex justify-between mb-4">
        <div>
          <button 
            onClick={() => applyFilter('Cardio')} 
            className={`rounded px-4 py-2 mr-4 ${filter === 'Cardio' ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white'}`}
          >
            Cardio
          </button>
          <button 
            onClick={() => applyFilter('General')} 
            className={`rounded px-4 py-2 ${filter === 'General' ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white'}`}
          >
            General
          </button>
        </div>
        <div>
          <button 
            onClick={() => applyFilter(null)} 
            className={`rounded px-4 py-2 ${!filter ? 'bg-gray-500 text-white' : 'bg-transparent text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white'}`}
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="w-full">
          {/* Table headings */}
          <div className="flex justify-between border-b py-2">
            <div className="w-1/2 px-4 font-bold text-xl">Speciality</div>
            <div className="w-1/2 mr-12 font-bold text-xl">Name</div>
          </div>
          {/* Table data */}
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="flex justify-between border-b py-2">
              <div className="w-1/2 px-4 text-l">{doctor.speciality}</div>
              <div className="w-1/2 px-4 text-l">{doctor.username}</div>
              <button 
                onClick={() => handleRemoveDoctor(doctor._id)} 
                className="rounded bg-red-500 text-white px-4 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
