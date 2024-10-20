import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';
import { userRouter } from './controllers/AuthController.js';
import { DoctorRouter } from './controllers/DoctorRouter.js';
// import { AppointmentRouter } from './controllers/AppointmentRouter.js';
import setupCleanupJob from './middleware/cleanup.js';
import { AppointmentRouter } from './controllers/AppointmentRouter.js';
import { ProfileRouter } from './controllers/ProfileRouter.js';

dotenv.config();

const db = mongoose.connect(process.env.MONGO_URI)
try {
    if(db){
        console.log("database connected");
    }
} catch (error) {
    console.log(error);
}

const app = express();

// if (process.env.NODE_ENV === 'production') {
//     dotenv.config({ path: '.env.production' });
// } else {
//     dotenv.config({ path: '.env' });
// }
app.use(cors({
    origin : process.env.VITE_URL || 'http://localhost:5173',
    methods : ["GET", "POST" ,"PUT","DELETE"],
    credentials :true
}));
app.use(express.json())

//ROUTES
app.use("/auth",userRouter)
app.use("/doctors",DoctorRouter)
app.use("/appointment",AppointmentRouter)
app.use("/profile", ProfileRouter)

setupCleanupJob();


app.listen(3000,(req,res)=>{
    console.log("server at 3000");
})