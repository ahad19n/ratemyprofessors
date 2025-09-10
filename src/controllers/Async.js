const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Async Controller")
});

module.exports = router;