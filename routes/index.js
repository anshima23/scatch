const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn"); // Corrected import
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

// Render home page with potential error messages
router.get("/", function (req, res) {
    const messages = req.flash("error") || []; // Ensure messages is an array
    res.render("index", { messages, isLoggedIn: false }); // Pass messages to view
});

// Render shop page with products if user is logged in
router.get('/shop', isLoggedIn, async function (req, res) {
    try {
        const products = await productModel.find();
        const success = req.flash("success") || []; // Ensure success is an array
        res.render("shop", { products, success });
    } catch (err) {
        console.error("Error fetching products:", err);
        req.flash("error", "Unable to load products.");
        res.redirect("/"); // Redirect to home or an error page
    }
});
router.get('/cart', isLoggedIn, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('cart'); // Populate cart with product details
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/shop");
        }
        const cart = user.cart; // Get the populated cart
        const bill = cart.reduce((total, item) => total + Number(item.price) - Number(item.discount), 0) + 20; // Calculate total bill
        
        res.render('cart', { cart, bill }); // Render cart with product details and bill
    } catch (err) {
        console.error("Error fetching cart items:", err);
        req.flash("error", "Unable to load cart.");
        res.redirect("/shop");
    }
});

router.post("/addtocart/:id", isLoggedIn, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/shop");
        }

        const product = await productModel.findById(req.params.id); // Retrieve product details
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/shop");
        }

        user.cart.push(product); // Add product details to cart
        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        console.error("Error adding product to cart:", err);
        req.flash("error", "Unable to add product to cart.");
        res.redirect("/shop");
    }
});

// Handle user logout
router.get("/logout", isLoggedIn, function (req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/"); // Redirect to home page
});

module.exports = router;
