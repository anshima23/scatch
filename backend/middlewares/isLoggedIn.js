const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
    // Check for token in cookies
    if (!req.cookies.token) {
        req.flash("error", "You need to login first.");
        return res.redirect("/"); // Redirect to home or login page
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Fetch user details from the database
        const user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        // If user is not found, handle the case
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/"); // Redirect to home or login page
        }

        // Attach user to request object
        req.user = user;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Handle token verification errors
        req.flash("error", "Invalid or expired token. Please log in again.");
        res.redirect("/"); // Redirect to home or login page
    }
};
