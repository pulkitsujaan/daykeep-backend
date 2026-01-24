const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), 
  (req, res) => {
    // Generate Token
    const payload = { id: req.user._id, name: req.user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Redirect to Frontend with Token
    // Change this URL to your Vercel app in production
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${CLIENT_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(payload))}`);
  }
);


router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);
router.put('/update', authController.updateUser);
router.put('/password',authController.updatePassword);

module.exports = router;