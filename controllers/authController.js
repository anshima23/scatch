const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already have an account. Please login with another account.");

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let newUser = await userModel.create({
            email,
            password: hash,
            fullname,
        });

        let token = generateToken(newUser);
        res.cookie("token", token);
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) return res.status(401).send("Email or Password incorrect");

    const result = await bcrypt.compare(password, user.password);
    if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.send("You can login");
    } else {
        res.status(401).send("Email or Password incorrect");
    }
};

module.exports.logout = function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
};
