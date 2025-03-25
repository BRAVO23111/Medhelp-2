import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { UserModel } from "../models/User.js";
import { DoctorModel } from "../models/Doctor.js";
import { sendConfirmationEmail } from "../utils/emailService.js";
import "../config/passport.js";

const router = express.Router();
const secret =  "mysecret"; // Store secret in environment variable

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate request body
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserModel({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user in both User and Doctor collections
    let user = await UserModel.findOne({ username }) || await DoctorModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Get user role
    const role = user instanceof UserModel ? user.role : user.role;

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role }, secret, { expiresIn: '1h' });

    res.json({ token, userId: user._id, role });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  async (req, res) => {
    try {
      // Store user in session
      req.session.user = {
        _id: req.user._id,
        role: req.user.role
      };

      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        secret,
        { expiresIn: '1h' }
      );

      // If email is available, send confirmation email for Google OAuth login
      if (req.user.email) {
        try {
          // Pass true as third parameter to indicate OAuth authentication
          await sendConfirmationEmail(req.user.email, req.user.username, true);
          req.user.isEmailVerified = true;
          await req.user.save();
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Continue even if email fails
        }
      }

      // Redirect to frontend with token and user info
      res.redirect(`${process.env.VITE_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&userId=${req.user._id}&role=${req.user.role}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.VITE_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }
  }
);

export { router as userRouter };
