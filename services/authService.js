const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepo = require('../repositories/userRepository');

// Email Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registerUser = async (name, email, password) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw new Error("Email already exists");

  // Logic: Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = crypto.randomBytes(20).toString('hex');

  const newUser = await userRepo.createUser({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires: Date.now() + 3600000
  });

  // Logic: Send Email
  const verifyUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verify your Journal Account',
    html: `<p>Click to verify: <a href="${verifyUrl}">Link</a></p>`
  });

  return newUser;
};

const verifyEmail = async (token) => {
  const user = await userRepo.findByVerificationToken(token);
  if (!user) throw new Error("Invalid or expired token");
  return await userRepo.markVerified(user);
};

const loginUser = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isVerified) throw new Error("Please verify your email first");

  // Logic: Generate Token
  const payload = { id: user._id, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1y' });

  return { token: "Bearer " + token, user };
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser
};