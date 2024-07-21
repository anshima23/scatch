const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("cart"); // Ensure you have a cart.ejs in your partials folder
});

module.exports = router;
