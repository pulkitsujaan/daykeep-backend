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
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - Link Google Account if missing
          if (!user.googleId) {
             user.googleId = profile.id;
             await user.save();
          }
          return done(null, user);
        } else {
          // User is NEW - Create them
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true,
            // FIX 3: Do NOT set password to "" (empty string). Just leave it undefined.
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.error("Google Auth Error:", err); // <--- LOG ERRORS HERE
        return done(err, null);
      }
    })
  );
};