import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  name: { type: String },
  age: { type: Number },
  contact: { type: String },
  medicalHistory: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const ProfileModel = mongoose.model('Profile', ProfileSchema);
