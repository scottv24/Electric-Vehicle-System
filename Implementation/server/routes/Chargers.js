const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const chargers = ["list", "of", "chargers"];
  res.json({ chargers });
});

module.exports = router;
