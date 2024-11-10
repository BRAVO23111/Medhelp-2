import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { userRouter } from './controllers/AuthController.js';
import { DoctorRouter } from './controllers/DoctorRouter.js';
import { AppointmentRouter } from './controllers/AppointmentRouter.js';
import setupCleanupJob from './middleware/cleanup.js';
import { ProfileRouter } from './controllers/ProfileRouter.js';
import { PrescriptionRouter } from './controllers/PrescriptionRouter.js';

// ES module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Database connection
const db = mongoose.connect(process.env.MONGO_URI)
try {
    if(db){
        console.log("database connected");
    }
} catch (error) {
    console.log(error);
}

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.VITE_URL || 'http://localhost:5173/',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadDir = path.join(__dirname, 'uploads', 'prescriptions');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ROUTES
app.use("/auth", userRouter);
app.use("/doctors", DoctorRouter);
app.use("/appointment", AppointmentRouter);
app.use("/profile", ProfileRouter);
app.use("/prescription", PrescriptionRouter);

setupCleanupJob();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});