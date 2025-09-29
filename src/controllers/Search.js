const express = require('express');
const router = express.Router();

const Professor = require('../models/Professor');

router.get('/', async (req, res) => {
  const rawQuery = req.query?.q;
  const queryParts = rawQuery.trim().split(/\s+/);

  const results = await Professor.find({
    $or: queryParts.map(part => ({
      fullName: { $regex: part, $options: "i" }
    }))
  }).populate('university');

  res.render('SearchResults', { rawQuery, results });
});

module.exports = router;