const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const entryRoutes = require('./routes/entries');
const authRoutes = require('./routes/auth');
const passport = require('passport'); // 1. Import Passport
const path = require('path'); // Import path


dotenv.config();
require('./config/passport')(passport);

const app = express();

// Middleware
app.use(express.json()); // Parses JSON body
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, // Allow cookies/headers if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})); // Allows your React app to talk to this server
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);



// Database Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Backend server is running on port ${process.env.PORT}!`);
});