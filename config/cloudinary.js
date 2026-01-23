// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// 1. Configuration (Adapted from your snippet)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. Storage Setup (The bridge for file uploads)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'journal_app_uploads', // Folder name in your Cloudinary Dashboard
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Limit file types
    // Optional: You can add transformations here if you want
    // transformation: [{ width: 1000, crop: "limit" }] 
  },
});

module.exports = {
  cloudinary,
  storage,
};