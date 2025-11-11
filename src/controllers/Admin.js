const express = require("express");
const mongoose = require("mongoose");

const Professor = require("../models/Professor");
const ProfessorImage = require("../models/ProfessorImage");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/addImage", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const { professorSlug } = req.body;

    if (!professorSlug) {
      return res.status(400).json({ error: "professorSlug is required" });
    }

    if (!file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Find the professor by slug
    const professor = await Professor.findOne({ slug: professorSlug });
    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    // Create and save the ProfessorImage document
    const professorImage = new ProfessorImage({
      professor: professor._id,
      image: file.buffer,
      contentType: file.mimetype
    });

    await professorImage.save();

    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
