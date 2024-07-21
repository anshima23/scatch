const express = require("express");
const router = express.Router(); // This initializes the router object
const upload = require("../config/multer-config");
const productModel = require("../models/product-model"); // Adjust the path if necessary

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
        req.flash("success","Product created successfully.");
        res.redirect("/owners/admin");
        res.send(product);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
