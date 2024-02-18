const express = require("express");
const router = express.Router();

// Import nested routes
const chargerRoutes = require("./Chargers");

// Set up standard root response
router.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Use imported routes
router.use("/chargers", chargerRoutes);

module.exports = router;
