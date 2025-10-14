const mongoose = require("mongoose");

module.exports = mongoose.model(
	"Report",
	new mongoose.Schema({
		rating: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProfessorRating",
			required: true,
		},
		reportText: { type: String, required: true, maxlength: 350 },
		createdAt: { type: Date, default: Date.now },
	})
);
