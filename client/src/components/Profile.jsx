import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';

import api from '../config/config';
import { Button } from "./ui/button";

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
    const fetchProfileAndAppointments = async () => {
      try {
        const profileResponse = await api.get('/profile/get', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (profileResponse.data && Object.keys(profileResponse.data).length > 0) {
          setProfile(profileResponse.data);
          setIsEditing(false);
        } else {
          setProfile(null);
          setIsEditing(true);
        }

        const appointmentsResponse = await api.get('/appointment/user/appointments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(appointmentsResponse);
        setAppointments(appointmentsResponse.data || []);
        setAppointmentsLoaded(true);

      } catch (error) {
        console.error('Error fetching profile or appointments:', error);
        setIsEditing(true);
      }
    };
  
    fetchProfileAndAppointments();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const profileData = { name, age, contact, medicalHistory };

    try {
      const response = await api.post('/profile/create', profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
      setMessage('Profile created successfully');
      setIsEditing(false);
    } catch (error) {
      setMessage('There was an error creating the profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const updatedProfileData = { name, age, contact, medicalHistory };

    try {
      const response = await api.put('/profile/update', updatedProfileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
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
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {profile && !isEditing ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Medical Profile</h2>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="default"
                  className="flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
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

              {appointmentsLoaded && appointments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Pending Appointments</h3>
                  <ul className="divide-y divide-gray-200">
                    {appointments.map((appointment, index) => (
                      <li key={index} className="py-4">
                        <div className="text-gray-800 font-medium">{appointment.doctor.username}</div>
                        <div className="text-gray-500">{appointment.date}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={profile ? handleUpdate : handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{profile ? 'Edit Profile' : 'Create Profile'}</h2>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical History</label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    rows="3"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
