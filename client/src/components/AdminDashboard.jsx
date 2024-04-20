import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch list of doctors from the server
    const fetchDoctors = async () => {
      try {
        const token = window.localStorage.getItem('token');
        if (!token) {
          console.log('Token not found');
          return;
        }
        console.log(token);
        const response = await axios.get("http://localhost:3000/doctors", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      
        setDoctors(response.data);
        console.log(response);
      } catch (error) {
        console.log('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">List of Doctors</h2>
      <div className="overflow-x-auto">
        <div className="w-full">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex justify-between border-b py-2">
              <div className="w-1/2 px-4">{doctor.username}</div>
              <div className="w-1/2 px-4">{doctor.speciality}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
