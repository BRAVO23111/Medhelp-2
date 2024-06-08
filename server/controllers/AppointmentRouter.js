import express from 'express';
import { AppointmentModel } from '../models/AppointmentSchema.js';
import { DoctorModel } from '../models/Doctor.js';
import { UserModel } from '../models/User.js'; // Import UserModel to get user details

const router = express.Router();

// Book an appointment
router.post("/bookappointment", async (req, res) => {
    try {
        const { doctorId, patientId, date } = req.body;

        const newAppointment = new AppointmentModel({
            doctor: doctorId,
            patient: patientId,
            date: date
        });
        await newAppointment.save();

        // Add the appointment to the patient's appointments array
        await DoctorModel.findByIdAndUpdate(doctorId, {
            // $push: { appointments: newAppointment._id },
            $addToSet: { appointments: patientId }
        });

        console.log(newAppointment); // Log appointment details
        res.status(201).json({ message: "Appointment booked successfully", newAppointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get all upcoming appointments
router.get("/appointments", async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({
            date: { $gte: new Date() }
        }).populate('doctor patient');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get appointments by user ID
router.get('/user/:userId/appointments', async (req, res) => {
    try {
        const userId = req.params.userId;
        const appointments = await AppointmentModel.find({
            patient: userId,
            date: { $gte: new Date() }
        }).populate('doctor patient');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user details along with their appointments
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId).populate('appointments');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all appointments for a doctor
router.get('/:doctorId/appointments', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        // Find all appointments for the doctor with future dates
        const appointments = await AppointmentModel.find({
            doctor: doctorId,
            date: { $gte: new Date() }
        }).populate('doctor patient');

        // Check if appointments array is empty
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for the given doctor" });
        }

        // Create an object to map patient IDs to patient details
        const patientMap = {};
        appointments.forEach(appointment => {
            if (appointment.patient && appointment.patient._id) {
                patientMap[appointment.patient._id] = appointment.patient;
            }
        });

        // Replace patient IDs with patient details in each appointment
        const populatedAppointments = appointments.map(appointment => ({
            ...appointment.toJSON(),
            patient: patientMap[appointment.patient._id]
        }));

        res.status(200).json(populatedAppointments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});



export { router as AppointmentRouter };
