const express = require('express');
const router = express.Router();

const University = require('../models/University');

router.get('/add', (req, res) => {
    res.render("UniversityAdd", { pageTitle: "Add a university" });
});

router.post('/add', async (req, res) => {
    try {
        const slug = req.body?.name.toString().trim().toLowerCase().replace(/\s+/g, '-');

        const university = new University({...req.body, slug });
        await university.save();

        res.redirect(`/university/${slug}`);
    } catch (error) {
        res.render("UniversityAdd", { pageTitle: "Add a university", error, ...req.body });
    }
});

router.get('/:slug', (req, res) => {
  res.render('UniversityView', { pageTitle: "" });
});

// router.get('/:slug/add', (req, res) => {
//   res.send(`GET Add new rating for ${req.params.slug}`);
// });

// router.post('/:slug/add', (req, res) => {
//   res.send(`POST Add new rating for ${req.params.slug}`);
// });

module.exports = router;