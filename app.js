// app.js

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const db = require("./config/mongoose-connection");
const expressSession = require("express-session");
const flash = require("connect-flash");
const indexRouter = require("./routes/indexRouter"); // Ensure this is correctly imported

require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


// Routes
app.use("/", indexRouter); // Mount indexRouter for the root route
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use('/owners', ownersRouter);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Ensure the database is connected before starting the server
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected to the database");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});
