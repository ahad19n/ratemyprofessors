const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("University Controller")
});

module.exports = router;