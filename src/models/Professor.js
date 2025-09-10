const mongoose = require("mongoose");

module.exports = mongoose.model("Professor", new mongoose.Schema({

  name: { type: String, required: true }

}));