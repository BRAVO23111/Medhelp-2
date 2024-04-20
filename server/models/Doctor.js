import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    speciality :{
        type : String,
        required : true
    }
})

export const DoctorModel  = mongoose.model("Doctor" ,DoctorSchema);