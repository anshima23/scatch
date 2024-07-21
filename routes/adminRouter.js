const express = require("express");
const router = express.Router();

// Redirect from /owners/admin to /create-products
router.get("/owners/admin", (req, res) => {
    res.redirect("/createproducts");
});

module.exports = router;
