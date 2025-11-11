const express = require("express");
const router = express.Router();

const Professor = require("../models/Professor");
const ProfessorImage = require("../models/ProfessorImage");

router.get("/getImage/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const professor = await Professor.findOne({ slug });
    if (!professor) return res.status(404).send("Professor not found");

    const imageDoc = await ProfessorImage.findOne({ professor: professor._id });
    if (!imageDoc) return res.status(404).send("Image not found");

    // Cache for 1 hour
    res.set({
      "Content-Type": imageDoc.contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=3600", // 1 hour
      "Expires": new Date(Date.now() + 3600 * 1000).toUTCString(), // 1 hour
    });

    res.send(imageDoc.image);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
