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

// Login route
router.post("/login", async function (req, res) {
    let { email, password } = req.body;

    try {
        // Find the user with the provided email
        let user = await ownerModel.findOne({ email });

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Compare the provided password with the stored hashed password
        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate a token
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token to the client
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

// Render admin dashboard or landing page for admins
router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success }); // Render a page that provides options, including creating products
});

module.exports = router;
