import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.js';

dotenv.config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await UserModel.findOne({ googleId: profile.id });
        
        if (user) {
          // User exists, return the user
          return done(null, user);
        } else {
          // Check if user with this email already exists
          const email = profile.emails[0].value;
          user = await UserModel.findOne({ email });
          
          if (user) {
            // User exists with this email, update with Google ID
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
          
          // Create a new user
          const newUser = new UserModel({
            username: profile.displayName,
            email: email,
            googleId: profile.id,
            role: 'patient', // Default role for Google OAuth users
            isEmailVerified: true // Email is verified through Google
          });
          
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;