const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const Rating = require("../models/ProfessorRating");

// GET /report/:id - Render the report review page for a specific professor

router.get("/:id", async (req, res) => {
	try {
		const rating = await Rating.findById(req.params.id).populate("professor");
		if (!rating || !rating.professor) {
			return res.status(404).send("Professor not found");
		}
		res.render("ReportReview", {
			professor: rating.professor.fullName,
			ratingText: rating.textSection,
		});
	} catch (err) {
		res.status(500).send("Server error");
	}
});

// POST /report/:id - Handle the submission of a report for a specific professor rating

router.post("/:id", async (req, res) => {
	try {
		const rating = await Rating.findById(req.params.id).populate("professor");
		if (!rating || !rating.professor) {
			return res.status(404).send("Professor not found");
		}
		const report = new Report({
			rating: rating._id,
			reportText: req.body.reason,
		});
		await report.save();
		res.render("ThankYou");
	} catch (err) {
		res.status(500).send("Server error");
	}
});

module.exports = router;
