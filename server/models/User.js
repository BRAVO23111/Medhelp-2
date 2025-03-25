import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if googleId is not present
    }
  },
  email: {
    type: String,
    sparse: true,
    unique: true
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
});

// Ensure indexes for faster query performance
UserSchema.index({ username: 1 });

export const UserModel = mongoose.model('User', UserSchema);
