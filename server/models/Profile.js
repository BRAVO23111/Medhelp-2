import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  age: { type: Number },
  contact: { type: String },
  medicalHistory: { type: String },
  // prescription: { type: String }, // If storing prescription file path or URL
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const ProfileModel = mongoose.model('Profile', ProfileSchema);