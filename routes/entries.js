const router = require('express').Router();
const entryController = require('../controllers/entryController');
const passport = require('passport');
const multer = require('multer');
const path = require('path');

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Unique name: timestamp + random number + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// --- ROUTES ---

// 1. New Upload Route (Accepts max 4 files)
router.post('/upload', 
  passport.authenticate('jwt', { session: false }), 
  upload.array('images', 4), // 'images' is the form field name
  (req, res) => {
    try {
      // Return the paths of the uploaded files
      const filePaths = req.files.map(file => `/uploads/${file.filename}`);
      res.json(filePaths);
    } catch (err) {
      res.status(500).json({ message: "File upload failed" });
    }
  }
);

// ... existing routes
router.get('/:userId', passport.authenticate('jwt', { session: false }), entryController.getUserEntries);
router.post('/', passport.authenticate('jwt', { session: false }), entryController.createEntry);
router.get('/stats/:userId', passport.authenticate('jwt', { session: false }), entryController.getStats);

module.exports = router;