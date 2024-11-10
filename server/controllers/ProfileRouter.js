import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ProfileModel } from '../models/Profile.js';

const router = express.Router();

// Create Profile
router.post('/create', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { name, age, contact, medicalHistory } = req.body;

  try {
    let profile = await ProfileModel.findOne({ userId });
    if (profile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    // Create a new profile
    profile = new ProfileModel({
      userId,
      name,
      age,
      contact,
      medicalHistory,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Profile with User Details
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
router.put('/update', authMiddleware, async (req, res) => {
  const { name, age, contact, medicalHistory } = req.body;

  try {
    const profile = await ProfileModel.findOneAndUpdate(
      { userId: req.user._id },
      { name, age, contact, medicalHistory, updatedAt: Date.now() },
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

// Delete Profile
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const profile = await ProfileModel.findOneAndDelete({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as ProfileRouter };
