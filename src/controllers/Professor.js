const express = require("express");
const router = express.Router();

const Professor = require("../models/Professor");
const University = require("../models/University");
const ProfessorRating = require("../models/ProfessorRating");
const Rating = require("../models/ProfessorRating");

const { joinName, genSlug, randomString } = require("../func");

router.get("/add", async (req, res) => {
	const universities = await University.find();
	res.render("AddProfessor", { universities });
});

router.post("/add", async (req, res) => {
	try {
		// Generate the fullName and slug using helper functions
		const fullName = joinName(req.body.first, req.body.middle, req.body.last);
		const slug = `${genSlug(fullName)}-${randomString(8)}`;

		// Find the University using the user provided slug
		const university = await University.findOne({ slug: req.body.university });

		// Write the new Professor to the database
		await new Professor({ ...req.body, slug, fullName, university }).save();

		// Redirect the client to view the newly created Professor
		res.redirect(`/professor/${slug}`);
	} catch (error) {
		// Render the AddProfessor page with the error message
		// and pre-populate the input fields for better UX
		const universities = await University.find();
		res.render("AddProfessor", { universities, error, values: req.body });
	}
});

router.get("/:slug", async (req, res) => {
	// Find the Professor using the user provided slug
	const professor = await Professor.findOne({ slug: req.params.slug }).populate(
		"university"
	);

	// Throw an 404 error if the Professor does not exist
	if (!professor) return res.status(404).render("errors/404");

	// Get all the Ratings for this Professor
	const ratings = await ProfessorRating.find({ professor });

	// Render the ViewProfessor view
	res.render("ViewProfessor", { professor, ratings });
});

router.get("/:slug/add", async (req, res) => {
	// Find the Professor using the user provided slug
	const professor = await Professor.findOne({ slug: req.params.slug }).populate(
		"university"
	);

	// Throw an 404 error if the Professor does not exist
	if (!professor) return res.status(404).render("errors/404");

	// Render the AddProfessorRating view
	res.render("AddProfessorRating", { professor });
});

router.post("/:slug/add", async (req, res) => {
	// Find the Professor using the user provided slug
	const professor = await Professor.findOne({ slug: req.params.slug });

	// Throw an 404 error if the Professor does not exist
	if (!professor) return res.status(404).render("errors/404");

	// Write the current Rating to the database
	try {
		await new ProfessorRating({ ...req.body, professor }).save();
	} catch (error) {
		return res.status(400).render("AddProfessorRating", { error, professor });
	}

	// Get all the Ratings for this Professor
	const ratings = await ProfessorRating.find({ professor });

	// Update statistics for the Professor
	let sumQuality = 0;
	let sumDifficulty = 0;
	let sumWouldTakeAgain = 0;
	const ratingDistribution = [0, 0, 0, 0, 0];

	ratings.forEach((r) => {
		sumQuality += r.quality;
		sumDifficulty += r.difficulty;
		if (r.wouldTakeAgain) sumWouldTakeAgain += 1;
		if (r.quality >= 1 && r.quality <= 5)
			ratingDistribution[r.quality - 1] += 1;
	});

	professor.numRatings = ratings.length;
	professor.avgRating = sumQuality / ratings.length;
	professor.avgDifficulty = sumDifficulty / ratings.length;
	professor.wouldTakeAgainPercent = (sumWouldTakeAgain / ratings.length) * 100;
	professor.ratingDistribution = ratingDistribution;

	// Save the updated Professor to the database
	await professor.save();
	res.redirect(`/professor/${req.params.slug}`);
});

// Incrementing Likes and Dislikes of a Rating

router.post("/:id/like", async (req, res) => {
	try {
		const rating = await Rating.findByIdAndUpdate(
			req.params.id,
			{ $inc: { numberOfLikes: 1 } },
			{ new: true }
		);
		res.json({ numberOfLikes: rating.numberOfLikes });
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/:id/dislike", async (req, res) => {
	try {
		const rating = await Rating.findByIdAndUpdate(
			req.params.id,
			{ $inc: { numberOfDislikes: 1 } },
			{ new: true }
		);
		res.json({ numberOfDislikes: rating.numberOfDislikes });
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
