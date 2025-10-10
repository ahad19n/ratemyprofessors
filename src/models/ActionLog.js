const mongoose = require("mongoose");

module.exports = new mongoose.model("ActionLog", new mongoose.Schema({

  acid: { type: String, required: true },
  route: { type: String, required: true },
  body: { type: String, required: true }

}, { timestamps: true }));