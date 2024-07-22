const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");

// Middleware
router.use(flash());

// Create a new owner (admin only)
router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
        return res
            .status(500)
            .send("You don't have permission to create a new owner");
    }

    let { fullname, email, password } = req.body;

    try {
        // Hash the password before saving
        let hashedPassword = await bcrypt.hash(password, 10);
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password: hashedPassword,
        });
        res.status(201).send(createdOwner);
    } catch (err) {
        console.error('Error creating owner:', err);
        res.status(500).send('Error creating owner');
    }
});


// Render admin dashboard or landing page for admins
router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success }); // Render a page that provides options, including creating products
});

module.exports = router;
