const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        const { email, password, fullname } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            req.flash('error', 'You already have an account. Please login.');
            return res.redirect('/'); // Redirect to home or create account page
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        });

        const token = generateToken(newUser);
        res.cookie("token", token);
       res.status(201).json({message:'Account created successfully.Please log in'})
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/'); // Redirect to home or create account page
    }
};


module.exports.loginUser = async function (req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            req.flash('error', 'Email or Password incorrect');
            return res.redirect('/'); // Redirect to home or login page
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = generateToken(user);
            res.cookie("token", token); // Store token in cookie
            return res.redirect('/shop'); // Redirect to shop page on successful login
        } else {
            req.flash('error', 'Email or Password incorrect');
            return res.redirect('/'); // Redirect to home or login page
        }
    } catch (err) {
        console.error("Error during login:", err);
        req.flash('error', 'Something went wrong');
        return res.redirect('/'); // Redirect to home or login page
    }
};
// Handle user logout
module.exports.logout = function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
};
