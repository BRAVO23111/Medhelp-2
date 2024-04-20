import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

const router = express.Router();
const secret = "mysecret";

router.post("/register", async (req, res) => {
  console.log(req.body.role);
  try {
    const { username, password, role } = req.body; // Include 'role' in the request body
    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({ username, password: hashedPassword, role }); // Save 'role' to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password ,role} = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role // Include 'role' in the JWT payload
      },
      secret
    );

    // Return token and user's role
    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as userRouter };
