const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Report Controller")
});

module.exports = router;