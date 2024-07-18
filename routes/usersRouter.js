const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.get("/", (req, res) => {
    res.send("hey it's working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", function (req, res) {
    res.clearCookie("token","");
    res.redirect("/");
});

module.exports = router;

