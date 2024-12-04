import express from 'express';
import { authenticateRole, authMiddleware } from '../middleware/authMiddleware.js';
import { AppointmentModel } from '../models/AppointmentSchema.js';
import { DoctorModel } from '../models/Doctor.js';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.js';

const router = express.Router();

// Get list of all doctors (accessible by patients and admins)
router.get('/', authMiddleware, authenticateRole('patient', 'admin'), async (req, res) => {
  try {
    const doctorList = await DoctorModel.find();
    res.status(200).json(doctorList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register a new doctor (accessible by admin)
router.post('/registerdoctor',authMiddleware,authenticateRole('admin'), async (req, res) => {
  try {
    const { username, password, speciality } = req.body;
    const existingDoctor = await DoctorModel.findOne({ username: username });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newDoctor = new DoctorModel({
      username: username,
      password: hashedPassword,
      speciality: speciality,
      role: 'doctor', // Set role to 'doctor'
    });
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.error('Error in doctor registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details by ID
router.get('/user/:userId',authMiddleware,authenticateRole('doctor', 'admin' ,'patient'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error); // Logging the error details
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a doctor (accessible by admin)
router.delete('/:doctorId', authMiddleware, authenticateRole('admin'), async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    await DoctorModel.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get appointments for a doctor
router.get('/appointments', authMiddleware, authenticateRole('doctor'), async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await AppointmentModel.find({
      doctor: doctorId,
      date: { $gte: new Date() }
    }).populate('doctor patient');
    if (!appointments) {
      return res.status(404).json({ error: 'No appointments found for this doctor' });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update doctor information
router.put('/:doctorId', authMiddleware, async (req, res) => {
    const { doctorId } = req.params;
    const { username, speciality } = req.body;

    try {
        // Find the doctor by ID and update their details
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            doctorId,
            { username, speciality },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if the doctor was found
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Return the updated doctor details
        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ message: 'Error updating doctor' });
    }
});

export { router as DoctorRouter };
