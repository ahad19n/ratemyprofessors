const mongoose = require("mongoose");

module.exports = new mongoose.model("ActionLog", new mongoose.Schema({

  ipAddr: { type: String, required: true },
  acid: { type: String, required: true },
  route: { type: String, required: true },
  headers: Object,
  body: { type: String, required: true }

}, { timestamps: true }));