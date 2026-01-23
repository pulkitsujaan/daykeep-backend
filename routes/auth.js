const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);
router.put('/update', authController.updateUser);

module.exports = router;