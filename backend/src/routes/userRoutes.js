const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route yang dilindungi
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
