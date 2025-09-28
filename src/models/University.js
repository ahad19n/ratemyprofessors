const mongoose = require("mongoose");

module.exports = mongoose.model("University", new mongoose.Schema({

    slug: { type: String, required: true, unique: true, unique: true },
    name: { type: String, required: true, unique: true, unique: true },

    province: { type: String, required: true },
    city: { type: String, required: true },

    website: { type: String, required: true },

}, { timestamps: true }));
