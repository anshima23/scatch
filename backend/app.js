const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

const dotenv = require("dotenv");
dotenv.config();

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index"); // Corrected import

// Import the mongoose connection
require("./config/mongoose-connection");


app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter); // Use indexRouter
app.use("/owners", ownersRouter);
app.use("/", usersRouter);
app.use("/products", productsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = []; // Initialize as an empty array
    }
    next();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
