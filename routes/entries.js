const router = require('express').Router();
const entryController = require('../controllers/entryController');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// --- ROUTES ---

// 1. New Upload Route (Accepts max 4 files)
router.post('/upload', upload.array('images'), (req, res) => {
  try {
    // Cloudinary automatically handles the upload before we get here.
    // The URLs are now available in req.files
    const fileUrls = req.files.map(file => file.path);
    
    // Return the Cloudinary URLs to the frontend
    res.json(fileUrls);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});
// ... existing routes
router.get('/:userId', passport.authenticate('jwt', { session: false }), entryController.getUserEntries);
router.post('/', passport.authenticate('jwt', { session: false }), entryController.createEntry);
router.get('/stats/:userId', passport.authenticate('jwt', { session: false }), entryController.getStats);

module.exports = router;