const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true // Helps search faster
  },
  date: { 
    type: String, // Format: "YYYY-MM-DD"
    required: true,
    unique: false // A user can only have one entry per date (handled in logic)
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  log: { 
    type: String, 
    default: "" 
  },
  // We can store the analysis here if we want to cache it
  analysisCache: {
    sentiment: String,
    keywords: [String]
  }
}, { timestamps: true });

// Compound index to ensure one entry per date per user
EntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Entry', EntrySchema);