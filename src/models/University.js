const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    website: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model("University", universitySchema);