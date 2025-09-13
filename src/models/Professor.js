const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  // university: { required: true, ref: University, type: mongoose.Schema.Types.ObjectId }
});

module.exports = new mongoose.model("Professor", schema);