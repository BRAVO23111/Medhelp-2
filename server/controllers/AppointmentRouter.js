import express from 'express';
import { AppointmentModel } from '../models/AppointmentSchema.js';


const router = express.Router();

router.post("/bookappointment", async (req, res) => {
    try {
        const { doctorId, patientId, date } = req.body;

        const newappointment = new AppointmentModel({
            doctor: doctorId,
            patient: patientId,
            date: date
        });
        console.log(newappointment);
        await newappointment.save();
        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

router.get("/appointments", async (req, res) => {
    try {
        const appointments = await AppointmentModel.find().populate('doctor patient');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
router.get('/user/:userId/appointments', async (req, res) => {
    try {
      const userId = req.params.userId;
      const appointments = await AppointmentModel.find({ patient: userId }).populate('doctor');
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

export { router as AppointmentRouter };
