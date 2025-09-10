const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Search Controller")
});

module.exports = router;