const mongoose = require("mongoose");
module.exports = new mongoose.model("ActionLog", new mongoose.Schema({

  ts: { type: Date, required: true },
  route: { type: String, required: true },
  acid: { type: String, required: true },
  ipAddr: { type: String, required: true },
  userAgent: { type: String, required: true },
  postBody: { type: String, required: true }

}, { versionKey: false, timestamps: false, }));
