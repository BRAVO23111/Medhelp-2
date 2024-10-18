import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaPhone, FaNotesMedical, FaEdit, FaSave, FaPlus } from 'react-icons/fa';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://medhelp-2.onrender.com/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data) {
          setProfile(response.data);
          localStorage.setItem('profile', JSON.stringify(response.data));
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsEditing(true);
      }
    };

    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (profile && !appointmentsLoaded) {
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.get(`https://medhelp-2.onrender.com/appointment/user/${userId}/appointments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          setAppointments(response.data);
          setAppointmentsLoaded(true);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
    };
    fetchAppointments();
  }, [profile, appointmentsLoaded]);

  useEffect(()=>{
   const  fetchProfile  =  async()=>{
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`https://medhelp-2.onrender.com/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("error fetching profile:", error);
    }
   }
  } , []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const profileData = { name, age, contact, medicalHistory };

    try {
      const response = await axios.post('https://medhelp-2.onrender.com/profile', profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
      localStorage.setItem('profile', JSON.stringify(response.data));
      setMessage('Profile created successfully');
      setIsEditing(false);
      setAppointmentsLoaded(false);
    } catch (error) {
      setMessage('There was an error creating the profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setName(profile.name);
    setAge(profile.age);
    setContact(profile.contact);
    setMedicalHistory(profile.medicalHistory);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const updatedProfileData = { name, age, contact, medicalHistory };

    try {
      const response = await axios.put('https://medhelp-2.onrender.com/profile', updatedProfileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
      localStorage.setItem('profile', JSON.stringify(response.data));
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setMessage('There was an error updating the profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Medical Dashboard</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center py-3 px-6 text-gray-700 bg-gray-200 bg-opacity-25 hover:bg-opacity-50">
            <FaUser className="mr-3" />
            Profile
          </a>
          <a href="#" className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-200 hover:bg-opacity-25">
            <FaCalendar className="mr-3" />
            Appointments
          </a>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {profile && !isEditing ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Medical Profile</h2>
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="text-lg font-semibold">{profile.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="text-lg font-semibold">{profile.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Medical History</p>
                    <p className="text-lg font-semibold">{profile.medicalHistory}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Profile' : 'Create Profile'}</h2>
                {message && (
                  <div className={`mb-4 p-4 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medical History</label>
                    <textarea
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isEditing ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />}
                  {isEditing ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          )}

          {appointments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Upcoming Appointments</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <li key={appointment._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center">
                        <FaNotesMedical className="text-blue-500 mr-4" size={24} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Doctor: {appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Time: {new Date(appointment.time).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;