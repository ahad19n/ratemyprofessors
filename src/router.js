const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/professor/:slug', (req, res) => {
  res.render('pages/professor', {
    pageTitle: "Zahid Anwar at COMSATS Islamabad",
    profFullName: "Zahid Anwar",
    profRating: 3.8,
    profNumReviews: 223,
    profDeptName: "Computer Science",
    profUniLink: "#",
    profUniName: "COMSATS Islamabad"
  });
});

module.exports = router;