const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

// Middleware
router.use(flash());

// Render login page
router.get("/login", (req, res) => {
    res.render("login", { error: req.flash('error') });
});

// Handle login POST request
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Attempting login for:", username);

        // Find the owner by email
        let user = await ownerModel.findOne({ email: username });

        // If not found in owners, check in users
        if (!user) {
            user = await userModel.findOne({ email: username });
        }

        // Check if user exists
        if (!user) {
            console.log("User not found");
            req.flash('error', 'Invalid credentials');
            return res.redirect('/owners/login');
        }

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        // If passwords do not match
        if (!match) {
            console.log("Password mismatch");
            req.flash('error', 'Invalid credentials');
            return res.redirect('/owners/login');
        }

        // Create a JWT token
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });

        // Set the token as a cookie
        res.cookie('token', token);

        console.log("Login successful, redirecting based on role");

        // Redirect based on role
        if (user.role === 'owner') {
            return res.redirect("/owners/admin");
        } else if (user.role === 'user') {
            return res.redirect("/cart");
        } else {
            req.flash('error', 'Unknown role');
            return res.redirect('/owners/login');
        }
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/owners/login');
    }
});

// Render admin dashboard or landing page for admins
router.get("/admin", (req, res) => {
    res.render("partials/adminDashboard"); // Render a page that provides options, including creating products
});

// Render createproducts page
router.get("/createproducts", (req, res) => {
    res.render("partials/createproducts");
});

module.exports = router;
