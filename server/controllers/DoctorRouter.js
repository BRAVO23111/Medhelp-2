import express from 'express';
import { authenticateRole, authMiddleware } from '../middleware/authMiddleware.js';
import { DoctorModel } from '../models/Doctor.js';
import { UserModel } from '../models/User.js';

const router = express.Router();

router.get("/",authMiddleware, authenticateRole('patient','admin'), async (req, res) => {
    try {
        const doctorList = await DoctorModel.find();
        res.status(200).json(doctorList); 
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
router.post("/registerdoctor",authMiddleware,authenticateRole('admin'), async (req, res) => {
    try {
        const { username, password, speciality } = req.body;
        console.log(req.body);
        const existingDoctor = await DoctorModel.findOne({ username:username });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor username already exists" });
        }
        const newDoctor = new DoctorModel({
            username: username,
            password: password,
            speciality: speciality,
        });
        await newDoctor.save();
        res.status(201).json({ message: "Doctor created successfully" });
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const user = await UserModel.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router as DoctorRouter };
