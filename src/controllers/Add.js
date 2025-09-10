const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Add Controller")
});

module.exports = router;