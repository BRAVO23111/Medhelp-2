import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import { userRouter } from './controllers/AuthController.js';
import { DoctorRouter } from './controllers/DoctorRouter.js';
import { AppointmentRouter } from './controllers/AppointmentRouter.js';

const db = mongoose.connect("mongodb+srv://test:test@cluster0.0dmeadv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
try {
    if(db){
        console.log("database connected");
    }
} catch (error) {
    console.log(error);
}

const app = express();
app.use(cors());
app.use(express.json())

//ROUTES
app.use("/auth",userRouter)
app.use("/doctors",DoctorRouter)
app.use("/appointment",AppointmentRouter)


app.listen(3000,(req,res)=>{
    console.log("server at 3000");
})