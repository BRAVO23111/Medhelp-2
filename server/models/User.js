import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        required: true
    }
})

export const UserModel  = mongoose.model("User" ,Userschema);