const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepo = require('../repositories/userRepository');
const dotenv = require('dotenv'); 

dotenv.config();

// 1. Configure Transporter (Use Port 465 for best stability on Render)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4,              // <--- Force IPv4 (Prevents IPv6 timeouts)
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  logger: true,           // <--- Log the handshake details
  debug: true,             // <--- Show debug info in logs
  // 2. Add these timeouts to prevent the "hanging" issue
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000
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

  // 3. Email Logic
  try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const verifyUrl = `${clientUrl}/verify/${verificationToken}`;

      await transporter.sendMail({
        from: `"DayKeep Journal" <${process.env.EMAIL_USER}>`, // <--- IMPORTANT
        to: email,
        subject: 'Verify your Journal Account',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #000;">Welcome to DayKeep, ${name}!</h2>
            <p>We are excited to have you start your journaling journey.</p>
            <p>Please verify your email to secure your account:</p>
            <br/>
            <a href="${verifyUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify My Account</a>
            <br/><br/>
            <p style="font-size: 12px; color: #888;">Or copy this link: ${verifyUrl}</p>
          </div>
        `
      });
      
      console.log(`Verification email sent to ${email}`);

  } catch (emailError) {
      console.error("Email failed to send:", emailError);
      // Optional: Delete user if email fails so they can try again
      // await userRepo.deleteUser(newUser._id);
  }

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
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

  return { token: "Bearer " + token, user };
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
};