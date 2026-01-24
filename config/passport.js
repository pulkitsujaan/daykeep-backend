const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path to your User model

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' 
      ? "https://daykeep-backend.onrender.com/api/auth/google/callback"
      : "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If user exists but has no googleId, link it (optional)
          if (!user.googleId) {
             user.googleId = profile.id;
             await user.save();
          }
          return done(null, user);
        } else {
          // 2. Create new user
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true, // Auto-verify Google users
            password: "" // No password for OAuth users
          };
          user = await User.create(newUser);
          return done(null, user);
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    })
  );
};