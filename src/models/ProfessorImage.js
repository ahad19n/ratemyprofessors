const mongoose = require("mongoose");
module.exports = new mongoose.model("ProfessorImage", new mongoose.Schema({

    professor: {  },
    image: { type: Buffer, required: true },
    contentType: { type: String, required: true },

}, { versionKey: false, timestamps: false, }));
