const mongoose = require("mongoose");
const Professor = require("./Professor");

module.exports = new mongoose.model("ProfessorImage", new mongoose.Schema({

    professor: { 
        required: true,
        ref: Professor,
        type: mongoose.Schema.Types.ObjectId
    },

    image: { type: Buffer, required: true },
    contentType: { type: String, required: true },

}, { versionKey: false, timestamps: false, }));
