const User = require('../models/User');

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerificationToken = async (token) => {
  return await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });
};

const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

const markVerified = async (user) => {
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  return await user.save();
};

module.exports = {
  findByEmail,
  findByVerificationToken,
  createUser,
  markVerified
};