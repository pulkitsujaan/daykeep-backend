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

  const getEffectiveDate = (dateObj) => {
    const d = new Date(dateObj);
    d.setHours(d.getHours() - 4); // Subtract 4 hours for Grace Period
    return d.toISOString().split('T')[0];
  };

  const todayEffective = getEffectiveDate(new Date());
  
  // Yesterday's effective date relative to today's effective date
  const yesterdayDateObj = new Date();
  yesterdayDateObj.setHours(yesterdayDateObj.getHours() - 4);
  yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
  const yesterdayEffective = yesterdayDateObj.toISOString().split('T')[0];

 // --- GENUINE STREAK CALCULATION ---
  // A 'Genuine' log is one where the 'date' string matches the 'createdAt' date
  const genuineEntries = entries.filter(e => {
    const logDate = e.date; // The day the user intended to log
    const createdEffectiveDate = getEffectiveDate(e.createdAt);
    return logDate === createdEffectiveDate;
  });

  // Sort genuine entries by date descending
  const sortedDates = genuineEntries
    .map(e => e.date)
    .sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  if (sortedDates.length > 0) {
    // Streak stays active if the latest genuine log matches Today or Yesterday (Effective)
    const isStreakActive = (sortedDates[0] === todayEffective || sortedDates[0] === yesterdayEffective);

    if (isStreakActive) {
      streak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const current = new Date(sortedDates[i]);
        const next = new Date(sortedDates[i + 1]);
        
        const diffTime = Math.abs(current - next);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }
  // Logic: Calculate Math
  const totalLogs = entries.length;
  const avgRating = totalLogs > 0 
    ? (entries.reduce((acc, curr) => acc + curr.rating, 0) / totalLogs).toFixed(1) 
    : 0;

  // Keyword Analysis (Existing)
  const allText = entries.map(e => e.log.toLowerCase()).join(" ");
  const struggleCount = (allText.match(/tired|hard|stuck|failed/g) || []).length;
  const victoryCount = (allText.match(/finished|done|win/g) || []).length;

  return {
    totalLogs: entries.length,
    genuineLogs: genuineEntries.length,
    avgRating,
    struggleCount,
    victoryCount,
    streak
  };
};

module.exports = {
  getEntries,
  saveEntry,
  getStatistics
};