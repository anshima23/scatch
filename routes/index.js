const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");

router.get("/",function(req,res){
    let error = req.flash("error");
    res.render("index",{error});
});

// In your route handler (e.g., indexRouter.js)
// In your route handler (e.g., indexRouter.js)
router.get('/shop', (req, res) => {
    const product = {
        image: 'url-to-image',  // Replace with actual image URL
        name: 'Product Name',
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
 
router.get("/logout",isloggedin,function (req,res){
    res.render("shop");
});


module.exports = router;