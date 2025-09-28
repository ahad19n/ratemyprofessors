const mongoose = require("mongoose");
const Professor = require("./Professor");

module.exports = mongoose.model("ProfessorRatings", new mongoose.Schema({

  professor: {
    ref: Professor,
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },

  quality: {
    type: Number,
    required: true,
    min: 1, max: 5,
    validate: { validator: Number.isInteger }
  },

  difficulty: {
    type: Number,
    required: true,
    min: 1, max: 5,
    validate: { validator: Number.isInteger }
  },

  helpfulVotes: { type: Number, required: true, default: 0 },

  forCredit: { type: Boolean, required: true },
  usedTextbook: { type: Boolean, required: true },
  wouldTakeAgain: { type: Boolean, required: true },

  courseCode: { type: String, required: true },
  gradeReceived: { type: String, required: true },

  textSection: {
    type: String,
    required: true,
    min: 50, max: 250
  },

}, { timestamps: true }));
