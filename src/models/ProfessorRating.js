const mongoose = require("mongoose");

const Professor = require("./Professor");

const schema = new mongoose.Schema({
    professor: { ref: Professor, required: true, type: mongoose.Schema.Types.ObjectId },
    quality: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    courseCode: { type: String, required: true },
    gradeReceived: { type: String, required: true },
    forCredit: { type: Boolean, required: true },
    usedTextbook: { type: Boolean, required: true },
    textSection: { type: String, required: true },    
    helpfulVotes: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("ProfessorRatings", schema);