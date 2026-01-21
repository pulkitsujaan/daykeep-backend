const Entry = require('../models/Entry');

const findByUserId = async (userId) => {
  return await Entry.find({ userId });
};

const upsertEntry = async (userId, date, data) => {
  const filter = { userId, date };
  // Combine data into the update object
  const update = { ...data };
  
  return await Entry.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true
  });
};

module.exports = {
  findByUserId,
  upsertEntry
};