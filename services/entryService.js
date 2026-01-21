const entryRepo = require('../repositories/entryRepository');

const getEntries = async (userId) => {
  return await entryRepo.findByUserId(userId);
};

const saveEntry = async (userId, entryData) => {
  const { date, rating, log, images } = entryData; // <--- Destructure images
  // Pass images to the repository
  return await entryRepo.upsertEntry(userId, date, { rating, log, images });
};

const getStatistics = async (userId) => {
  const entries = await entryRepo.findByUserId(userId);

  // Logic: Calculate Math
  const totalLogs = entries.length;
  const avgRating = totalLogs > 0 
    ? (entries.reduce((acc, curr) => acc + curr.rating, 0) / totalLogs).toFixed(1) 
    : 0;

  // Logic: Keyword Analysis
  const allText = entries.map(e => e.log.toLowerCase()).join(" ");
  const struggleCount = (allText.match(/tired|hard|stuck|failed/g) || []).length;
  const victoryCount = (allText.match(/finished|done|win/g) || []).length;

  return {
    totalLogs,
    avgRating,
    struggleCount,
    victoryCount
  };
};

module.exports = {
  getEntries,
  saveEntry,
  getStatistics
};