const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout } = require("../../controllers/authController");

// Route to handle user registration
router.post("/register", registerUser);

// Route to handle user login
router.post("/login", loginUser);

// Route to handle user logout
router.get("/logout", logout);

module.exports = router;
