const express = require("express");
const router = express.Router(); // This initializes the router object
const multer = require('multer'); // Import multer
const productModel = require("../models/product-model"); // Adjust the path if necessary

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Handle POST request to /create route
router.post("/create", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        // Create a product entry in the database
        let product = await productModel.create({
            image: req.file.buffer, // Store the image buffer in the database
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        res.send(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle /create-products route
router.get("/createproducts", (req, res) => {
    res.render("partials/createproducts"); // Ensure the path is correct
});

module.exports = router;
