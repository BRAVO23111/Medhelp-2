import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'doctor' // Default role for doctors
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export const DoctorModel = mongoose.model("Doctor", DoctorSchema);
