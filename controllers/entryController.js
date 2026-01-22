const entryService = require('../services/entryService');

const getUserEntries = async (req, res) => {
  try {
    // If using passport, req.user.id comes from the token
    const entries = await entryService.getEntries(req.params.userId);
    res.json(entries);
  } catch (err) {
    console.error("❌ ERROR in getUserEntries:", err);
    res.status(500).json({ message: err.message });
  }
};

const createEntry = async (req, res) => {
  try {
    const { userId, date, rating, log, images, tasks } = req.body;
    const entry = await entryService.saveEntry(userId, { date, rating, log, images, tasks });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await entryService.getStatistics(req.params.userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserEntries, createEntry, getStats };