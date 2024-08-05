const express = require("express");
const router = express.Router(); // This initializes the router object
const upload = require("../config/multer-config");
const productModel = require("../models/product-model"); // Adjust the path if necessary

// Handle POST request to /create route
router.post("/create", upload.single("productImage"), async function (req, res) {
    try {
        let { productName, productPrice, discountPrice, backgroundColor, panelColor, textColor } = req.body;

        // Create a product entry in the database
        let product = await productModel.create({
            image: req.file.buffer, // Store the image buffer in the database
            name: productName,
            price: productPrice,
            discount: discountPrice,
            bgcolor: backgroundColor,
            panelcolor: panelColor,
            textcolor: textColor,
        });

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
