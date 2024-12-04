import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUserEdit, FaTrash } from 'react-icons/fa';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
} from '@mui/material';
import api from '../config/config';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ username: '', speciality: '' });
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/doctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Error deleting doctor');
    }
  };

  const handleAddDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/doctors', newDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors([...doctors, response.data]);
      setNewDoctor({ username: '', speciality: '' });
      setOpenAdd(false);
    } catch (error) {
      console.error('Error adding doctor:', error);
      setError('Error adding doctor');
    }
  };

  const handleEditDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/doctors/${currentDoctor._id}`, currentDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctors.map((doctor) => (doctor._id === currentDoctor._id ? response.data : doctor)));
      setCurrentDoctor(null);
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError('Error updating doctor');
    }
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setCurrentDoctor(null);
    setOpenEdit(false);
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Manage Doctors</h1>
      <div className="flex justify-end mb-6">
        <Button
          variant="contained"
          startIcon={<FaUserPlus />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleOpenAdd}
        >
          Add Doctor
        </Button>
      </div>
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-gray-900 font-bold">
                    {doctor.username}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Speciality: {doctor.speciality}
                  </Typography>
                  <div className="flex justify-end mt-4 space-x-2">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(doctor)}
                      className="hover:text-blue-600"
                    >
                      <FaUserEdit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(doctor._id)}
                      className="hover:text-red-600"
                    >
                      <FaTrash />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Add Doctor Modal */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <Typography variant="h5" className="font-bold mb-4">
              Add Doctor
            </Typography>
            <TextField
              label="Username"
              fullWidth
              className="mb-4"
              value={newDoctor.username}
              onChange={(e) => setNewDoctor({ ...newDoctor, username: e.target.value })}
            />
            <TextField
              label="Speciality"
              fullWidth
              className="mb-4"
              value={newDoctor.speciality}
              onChange={(e) => setNewDoctor({ ...newDoctor, speciality: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCloseAdd} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddDoctor} variant="contained" color="primary">
                Add
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <Typography variant="h5" className="font-bold mb-4">
              Edit Doctor
            </Typography>
            <TextField
              label="Username"
              fullWidth
              className="mb-4"
              value={currentDoctor?.username || ''}
              onChange={(e) => setCurrentDoctor({ ...currentDoctor, username: e.target.value })}
            />
            <TextField
              label="Speciality"
              fullWidth
              className="mb-4"
              value={currentDoctor?.speciality || ''}
              onChange={(e) => setCurrentDoctor({ ...currentDoctor, speciality: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCloseEdit} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={handleEditDoctor} variant="contained" color="primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
