const express = require("express");
const router = express.Router();

const Professor = require("../models/Professor");
const ProfessorImage = require("../models/ProfessorImage");

router.get("/getImage/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the professor by slug
    const professor = await Professor.findOne({ slug });
    if (!professor) {
      return res.status(404).send("Professor not found");
    }

    // Find the image for that professor
    const imageDoc = await ProfessorImage.findOne({ professor: professor._id });
    if (!imageDoc) {
      return res.status(404).send("Image not found");
    }

    // Set the correct content type and send the image buffer
    res.set("Content-Type", imageDoc.contentType);
    res.send(imageDoc.image);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
