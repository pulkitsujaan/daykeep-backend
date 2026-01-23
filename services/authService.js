const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const userRepo = require('../repositories/userRepository');
const dotenv = require('dotenv'); 

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
     const verifyUrl = `${clientUrl}/verify/${verificationToken}`;

     // Send using Resend API (No timeouts!)
     await resend.emails.send({
       from: 'onboarding@resend.dev', // Use this test email for now
       to: email,
       subject: 'Verify your Journal Account',
       html: `<p>Click here: <a href="${verifyUrl}">Verify</a></p>`
     });

   } catch (error) {
     console.error("Email Error:", error);
   }
      // Optional: You could delete the user here if you want to force them to try again
      // await userRepo.deleteUser(newUser._id);
      // throw new Error("Could not send verification email. Please try again.");

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