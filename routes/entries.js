const router = require('express').Router();
const Entry = require('../models/Entry');

// GET: Fetch all logs for a user
router.get('/:userId', async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.params.userId });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST: Create or Update a log (Upsert)
router.post('/', async (req, res) => {
  const { userId, date, rating, log } = req.body;

  try {
    // Check if entry exists for this date/user
    const filter = { userId, date };
    const update = { rating, log };
    
    // { new: true } returns the updated document
    // { upsert: true } creates it if it doesn't exist
    const entry = await Entry.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });

    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET: Analysis Stats (Moving math to backend)
router.get('/stats/:userId', async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.params.userId });

    // 1. Calculate Average
    const totalLogs = entries.length;
    const avgRating = totalLogs > 0 
      ? (entries.reduce((acc, curr) => acc + curr.rating, 0) / totalLogs).toFixed(1) 
      : 0;

    // 2. Simple Keyword Count (Server side)
    const allText = entries.map(e => e.log.toLowerCase()).join(" ");
    const struggleCount = (allText.match(/tired|hard|stuck|failed/g) || []).length;
    const victoryCount = (allText.match(/finished|done|win/g) || []).length;

    // 3. Send back processed data
    res.status(200).json({
      totalLogs,
      avgRating,
      struggleCount,
      victoryCount
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;