import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ProfileModel } from '../models/Profile.js';
import { UserModel } from '../models/User.js';

const router = express.Router();

// Create or update user profile
router.post('/', authMiddleware, async (req, res) => {
  const { name , age, contact, medicalHistory } = req.body;

  try {
    // Fetch the user from the database
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile exists
    let profile = await ProfileModel.findOne({ user: req.userId });
    
    if (profile) {
      // Update existing profile
      profile.name = name || profile.name;
      profile.age = age || profile.age;
      profile.contact = contact || profile.contact;
      profile.medicalHistory = medicalHistory || profile.medicalHistory;
      profile.updatedAt = Date.now();
    } else {
      // Create new profile
      profile = new ProfileModel({
        user: req.userId,
        name, // Link to user
        age,
        contact,
        medicalHistory,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch the user from the database
    const user = req.user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the user's profile from the database
    const profile = await ProfileModel.findOne({ user: req.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
    }
    });

// Delete user profile
  
router.delete('/', authMiddleware , async(req,res)=>{
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await  ProfileModel.findOneAndDelete({ user: req.userId });
    
    res.status(200).json({ message: 'Profile deleted successfully' });
    
  } catch (error) {
    console.error('Error Deleting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Update user profile
router.put('/', authMiddleware, async (req, res) => {
  const { name , age, contact, medicalHistory } = req.body;

  try {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: req.userId },
      {name , age, contact, medicalHistory, updatedAt: Date.now() },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as ProfileRouter };
