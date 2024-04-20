// authMiddleware.js

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

const secret = "mysecret";

// Define the valid roles in your application
const validRoles = ['admin', 'patient', 'doctor'];

const authenticateRole = (...roles) => async (req, res, next) => {
  console.log(roles);
  try {
    const user = req.user; // Get the user object from the request
    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    console.error('Error in authenticateRole middleware:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};




const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;
    // Check if token is present
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    
    jwt.verify(token.split(" ")[1], secret, async (err, decoded) => {
      if (err) {
        console.error('Error decoding token:', err);
        return res.status(401).json({ message: 'Invalid token.' });
      }
      
      // Log the decoded payload to inspect its content
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};




export { authMiddleware, validRoles,authenticateRole };
