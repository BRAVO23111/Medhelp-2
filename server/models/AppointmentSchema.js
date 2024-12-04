import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reason : {
        type: String,
        required: true
    }
});

// Ensure indexes for faster query performance
AppointmentSchema.index({ date: 1 });
AppointmentSchema.index({ doctor: 1 });
AppointmentSchema.index({ patient: 1 });

export const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
