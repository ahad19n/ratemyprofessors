const express = require('express');
const router = express.Router();

const Professor = require('../models/Professor');
const { genSlug, randomString } = require('../func');

router.get('/add', (req, res) => {
  res.render('ProfessorAdd', { pageTitle: 'Add a professor' });
});

router.post('/add', async (req, res) => {
    try {
        const slug = `${genSlug(req.body.name)}-${randomString(6)}`;

        const professor = new Professor({...req.body, slug });
        await professor.save();

        res.redirect(`/professor/${slug}`);
    } catch (error) {
        res.render("ProfessorAdd", { pageTitle: "Add a professor", error, ...req.body });
    }
});

router.get('/:slug', (req, res) => {
  res.render('ProfessorView');
});

router.get('/:slug/add', (req, res) => {
  res.render('ProfessorRatingAdd', { pageTitle: 'Add a rating'});
});

router.post('/:slug/add', (req, res) => {
  res.send(`POST Add new rating for ${req.params.slug}`);
});

module.exports = router;