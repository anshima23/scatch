const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const flash = require("connect-flash");

// Middleware
router.use(flash());

// Render home page
router.get("/", (req, res) => {
    res.render("partials/home");
});

// Render create account page
router.get("/create-account", (req, res) => {
    res.render("partials/createAccount");
});

// Render login page
router.get("/login", (req, res) => {
    res.render("partials/login", { error: req.flash('error') });
});

router.get("/cart", (req, res) => {
    // Example placeholder data
    const cartItems = [
        { id: 1, name: 'Product 1', quantity: 1, price: 100 },
        { id: 2, name: 'Product 2', quantity: 2, price: 200 },
    ];

    res.render("partials/cart", { cartItems });
});

// Handle user registration
router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect("/create-account");
    }

    try {
        console.log("Registering user:", username);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            fullname: username,
            email: email,
            password: hashedPassword,
            role: 'user'
        });
        await newUser.save();

        console.log("User registered successfully:", newUser);

        res.redirect("/login");
    } catch (err) {
        console.error("Error during user registration:", err);
        req.flash('error', 'Something went wrong');
        res.redirect("/create-account");
    }
});

// Handle user login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
            req.flash('error', 'Invalid credentials');
            return res.redirect("/login");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Invalid credentials');
            return res.redirect("/login");
        }
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie('token', token);
        res.redirect("/products");
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect("/login");
    }
});

// Render products page
router.get("/products", (req, res) => {
    res.render("partials/products"); // Assuming you have a products.ejs in partials folder
});

router.get("/shop", (req, res) => {
    // Example data, replace this with actual data from your database or other source
    const products = [
        { name: 'Product 1', image: 'path/to/image1.jpg', price: 29.99 },
        { name: 'Product 2', image: 'path/to/image2.jpg', price: 39.99 },
        // Add more products as needed
    ];

    // Render the shop page with products data
    res.render("partials/shop", { products });
});

module.exports = router;
