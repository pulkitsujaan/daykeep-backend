const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const entryRoutes = require('./routes/entries');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parses JSON body
app.use(cors()); // Allows your React app to talk to this server

// Database Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/entries", entryRoutes);

app.listen(5000, () => {
  console.log("Backend server is running on port 5000!");
});