const express = require("express");
const authenticateUser = require("../middlewares/authMiddleware"); // Import middleware

const router = express.Router();

// Protected route - Get user profile
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
