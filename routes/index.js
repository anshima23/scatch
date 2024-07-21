const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn"); // Corrected import
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

// Render home page with potential error message
router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, isLoggedIn: false });
});

// Render shop page with products if user is logged in
router.get('/shop', isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

// Render cart page with user's cart items and calculated bill
router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);
    res.render("cart", { user, bill });
});

// Add product to user's cart
router.get("/addtocart/:id", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id); // Corrected to req.params.id
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop"); // Corrected redirection
});

// Handle user logout
router.get("/logout", isLoggedIn, function (req, res) {
    res.clearCookie("token"); // Clear token cookie
    req.flash("success", "Logged out successfully");
    res.redirect("/"); // Redirect to home or login page
});

module.exports = router;
