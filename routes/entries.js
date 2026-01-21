const router = require('express').Router();
const entryController = require('../controllers/entryController');
const passport = require('passport');

// Protected Routes (require JWT)
router.get('/:userId', passport.authenticate('jwt', { session: false }), entryController.getUserEntries);
router.post('/', passport.authenticate('jwt', { session: false }), entryController.createEntry);
router.get('/stats/:userId', passport.authenticate('jwt', { session: false }), entryController.getStats);

module.exports = router;