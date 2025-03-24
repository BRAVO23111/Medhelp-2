import express from 'express';
import { authenticateRole, authMiddleware } from '../middleware/authMiddleware.js';
import { AppointmentModel } from '../models/AppointmentSchema.js';
import { DoctorModel } from '../models/Doctor.js';
import { UserModel } from '../models/User.js';
import { sendSms } from '../sendsms.js';
// Assuming sendSms is set up for Twilio integration


const router = express.Router();

// Book an appointment
router.post("/bookappointment", authMiddleware, async (req, res) => {
    try {
        const { doctorId, patientId, date, time, reason } = req.body;

        // Fetch patient's details to get the name
        const patient = await UserModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        // Create a new appointment
        const newAppointment = new AppointmentModel({
            doctor: doctorId,
            patient: patientId,
            date,
            time,
            reason,
        });
        await newAppointment.save();

        // Add appointment to doctor and user records
        await DoctorModel.findByIdAndUpdate(doctorId, { $push: { appointments: newAppointment._id } });
        await UserModel.findByIdAndUpdate(patientId, { $push: { appointments: newAppointment._id } });

        // Send SMS confirmation to patient
        if (patient.contact) {
            await sendSms(patient.contact, `Your appointment is confirmed on ${date} at ${time}. Reason: ${reason}.`);
        }

        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: "Error booking appointment." });
    }
});

// Get all upcoming appointments
router.get("/appointments",authenticateRole("doctor" ,'admin'),  authMiddleware, async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ date: { $gte: new Date() } })
            .populate('doctor', 'name specialty')
            .populate('patient', 'name contact');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments." });
    }
});

// Get appointments by user ID
router.get('/user/appointments',authMiddleware, async (req, res) => {
    try {
        const userId = req.user
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
        const user = await UserModel.findById(userId).populate({
            path: 'appointments',
            populate: { path: 'doctor', select: 'name specialty' }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details." });
    }
});

// Get all appointments for a specific doctor
router.get('/:doctorId/appointments', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const appointments = await AppointmentModel.find({
            doctor: doctorId,
            date: { $gte: new Date() }
        })
            .populate('doctor', 'name specialty')
            .populate('patient', 'name contact');

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for the given doctor" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor appointments." });
    }
});

// Mark an appointment as done
router.put('/:appointmentId/done', authenticateRole("doctor", "admin"), authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Find the appointment by ID and update its status
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { done: true }, // Assuming you have a 'done' field in your Appointment model
            { new: true } // Return the updated document and run validators
        )
        .populate('doctor', 'name') // Populate only the 'name' field of the doctor
        .populate('patient', 'name'); // Populate only the 'name' field of the patient

        // Check if the appointment was found
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Return the updated appointment details
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error marking appointment as done:', error);
        res.status(500).json({ message: 'Error marking appointment as done' });
    }
});


export { router as AppointmentRouter };
