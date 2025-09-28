const express = require('express');
const router = express.Router();

const { genSlug } = require('../func');
const University = require('../models/University');

router.get('/add', async (req, res) => {
  res.render("AddUniversity");
});

router.post('/add', async (req, res) => {
  try {
    // Create a url-safe slug using the name of the University
    const slug = genSlug(req.body?.name);

    // Write the new University to the database
    await new University({...req.body, slug }).save();

    // Redirect the client to view the newly created University
    res.redirect(`/university/${slug}`);
  }

  catch (error) {
    // Render the AddUniversity page with the error message
    // and pre-populate the input fields for better UX
    res.render("AddUniversity", { error, values: req.body });
  }
});

router.get('/:slug', async (req, res) => {
  // Find the University using the user provided slug
  const university = await University.findOne({ slug: req.params.slug });

  // Throw an 404 error if the University does not exist
  if (!university) return res.status(404).render('errors/404');

  // Render the ViewUniversity view
  res.render('ViewUniversity', { university });
});

// router.get('/:slug/add', (req, res) => {});
// router.post('/:slug/add', (req, res) => {});

module.exports = router;
