const express = require("express");
const router = express.Router();

// Handle /create-products route
router.get("/createproducts", (req, res) => {
    res.render("partials/createproducts"); // Ensure the path is correct
});

module.exports = router;
