const mongoose = require("mongoose");

module.exports = mongoose.model("Professor", new mongoose.Schema({

  name: { type: String, required: true },
  slug: { type: String, required: true },

  university: {
    ref: University
    type: mongoose.Schema.Types.ObjectId,
  }

}));