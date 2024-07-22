const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const flash = require("connect-flash");
const Product = require('../models/product-model'); 

// Middleware
router.use(flash());
// Render home page
router.get("/", (req, res) => {
    res.render("partials/home");
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

// Render create account page
router.get("/create-account", (req, res) => {
    res.render("partials/createAccount");
});


router.get("/cart", (req, res) => {
    // Example placeholder data
    const cartItems = [
        { id: 1, name: 'Product 1', quantity: 1, price: 100 },
        { id: 2, name: 'Product 2', quantity: 2, price: 200 },
    ];

    res.render("partials/cart", { cartItems });
});



// Render products page
router.get("/products", (req, res) => {
    res.render("partials/products"); // Assuming you have a products.ejs in partials folder
});

router.get('/shop', (req, res) => {
    // Example product data
    const product = {
        image: 'https://via.placeholder.com/150',  // Use a valid image URL
        name: 'Sample Product',
        price: 19.99
    };
    res.render('partials/shop', { product });
});

module.exports = router;
