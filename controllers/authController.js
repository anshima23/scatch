const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

// Handle user registration
module.exports.registerUser = async function (req, res) {
    try {
        const { email, password, fullname } = req.body;

        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) return res.status(401).send("You already have an account. Please login with another account.");

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        });

        // Generate and set token
        const token = generateToken(newUser);
        res.cookie("token", token);
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Handle user login
module.exports.loginUser = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send("Email or Password incorrect");

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = generateToken(user);
            res.cookie("token", token);
            res.send("You can login");
        } else {
            res.status(401).send("Email or Password incorrect");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Something went wrong");
    }
};

// Handle user logout
module.exports.logout = function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
};
