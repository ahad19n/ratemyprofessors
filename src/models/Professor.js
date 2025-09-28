const mongoose = require("mongoose");
const University = require('./University');

module.exports = new mongoose.model("Professor", new mongoose.Schema({

  slug: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  departmentName: { type: String, required: true },
  directoryUrl: { type: String, required: true },

  university: {
    required: true,
    ref: University,
    type: mongoose.Schema.Types.ObjectId
  },

  avgRating: { type: Number, required: true, default: 0},
  avgDifficulty: { type: Number, required: true, default: 0 },

  numRatings: { type: Number, required: true, default: 0 },
  ratingDistribution: { type: Array, required: true, default: [0, 0, 0, 0, 0] },

  wouldTakeAgainPercent: { type: Number, required: true, default: 0 },

}, { timestamps: true }));
