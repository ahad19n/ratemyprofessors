const express = require('express');
const router = express.Router();

const Professor = require('../models/Professor');
const University = require('../models/University');
const { genSlug, randomString } = require('../func');

router.get('/add', async (req, res) => {
  try {
    const universities = await University.find().lean();
    res.render('ProfessorAdd', { pageTitle: 'Add a professor', universities });
  }

  catch (error) {
    console.error(`[ERROR] Failed to render /professor/add:`, error);
    res.status(500).render('errors/500');
  }
});

router.post('/add', async (req, res) => {
    try {
        const fullName = `${req.body.first} ${req.body.middle} ${req.body.last}`
        const slug = `${genSlug(fullName)}-${randomString(8)}`;

        // Find the ObjectId of the university from the user-provided university slug
        const university = await University.findOne({ slug: req.body.university });

        console.log(university.id)

        const professor = new Professor({...req.body, slug, fullName, university: university._id });
        await professor.save();

        res.redirect(`/professor/${slug}`);
    }

    catch (error) {
      const universities = await University.find();
      res.render("ProfessorAdd", { pageTitle: "Add a professor", universities, error, ...req.body });
    }
});

router.get('/:slug', async (req, res) => {
  try {
    const professor = await Professor.findOne({ slug: req.params.slug }).populate('university').lean();

    if (!professor) return res.status(404).render('errors/404');

    res.render('ProfessorView', {
      ...professor,
      pageTitle: `${professor.fullName} at ${professor.university.name}`
    });
  }

  catch (error) {
    console.error(`[ERROR] Failed to render /professor/${req.params.slug}:`, error);
    res.status(500).render('errors/500');
  }
});

// router.get('/:slug/add', (req, res) => {
//   res.render('ProfessorRatingAdd', { pageTitle: 'Add a rating'});
// });

// router.post('/:slug/add', (req, res) => {
//   res.send(`POST Add new rating for ${req.params.slug}`);
// });

module.exports = router;