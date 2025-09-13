const mongoose = require("mongoose");

const University = require('./University');

const schema = new mongoose.Schema({
  slug: { type: String, required: true },
  fullName: { type: String, required: true },
  deptName: { type: String, required: true },

  university: { type: mongoose.Schema.Types.ObjectId, required: true, ref: University },

  avgRating: { type: Number, required: true, default: 0},
  numRatings: { type: Number, required: true, default: 0 },

});

module.exports = new mongoose.model("Professor", schema);