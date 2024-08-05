const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const authController = require("../controllers/authController");

// Middleware
router.use(flash());



// Render create account page
router.get("/create-account", (req, res) => {
    res.render("partials/createAccount");
});


// Handle user registration
router.post("/register", authController.registerUser);

// Handle user login
router.post("/login", authController.loginUser);

// Handle user logout
router.get("/logout", authController.logout);

// Render cart page
router.get("/cart", (req, res) => {
    const cartItems = [
        { id: 1, name: 'Product 1', quantity: 1, price: 100 },
        { id: 2, name: 'Product 2', quantity: 2, price: 200 },
    ];

    res.render("partials/cart", { cartItems });
});

// Render products page
router.get("/products", (req, res) => {
    res.render("partials/products");
});

// Render shop page
router.get('/shop', (req, res) => {
    const product = {
        image: 'https://via.placeholder.com/150',
        name: 'Sample Product',
        price: 19.99
    };
    res.render('partials/shop', { product });
});

module.exports = router;
