const express = require('express');
const router = express.Router();

router.get('/add', (req, res) => {
  res.render('ProfessorAdd', { pageTitle: 'Add a professor' });
});

router.post('/add', (req, res) => {
  res.send('POST Add new professor');
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