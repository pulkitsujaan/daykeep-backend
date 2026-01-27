const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');


router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);
router.put('/update', authController.updateUser);
router.put('/password',authController.updatePassword);

module.exports = router;