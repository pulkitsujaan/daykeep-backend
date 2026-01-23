const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "User" },
  
  // Verification Fields
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  
  profilePicture: { type: String, default: "" }, // Current active PFP
  profilePictureHistory: { type: [String], default: [] }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);