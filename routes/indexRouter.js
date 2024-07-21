const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const flash = require("connect-flash");
const Product = require('../models/product-model'); 

// Middleware
router.use(flash());
router.post('/createproducts', async (req, res) => {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        const product = new Product({
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
            // Handle image if applicable
        });

        await product.save();
        res.redirect('/shop'); // Redirect or respond as needed
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Server Error');
    }
});
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

router.get('/shop', (req, res) => {
    // Example product data
    const product = {
        image: 'https://via.placeholder.com/150',  // Use a valid image URL
        name: 'Sample Product',
        price: 19.99
    };
    res.render('partials/shop', { product });
});


router.get('/test', (req, res) => {
    res.render('partials/shop', {
        product: {
            image: 'https://via.placeholder.com/150',
            name: 'Test Product',
            price: 29.99
        }
    });
});
module.exports = router;
