const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Change this!

// ✅ Get User Info (Protected Route)
router.get("/user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
