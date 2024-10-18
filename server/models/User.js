import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

// Ensure indexes for faster query performance
UserSchema.index({ username: 1 });

export const UserModel = mongoose.model('User', UserSchema);
