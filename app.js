const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");

dotenv.config();

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
    // Removed deprecated options
})
.then(() => console.log('Database connected successfully'))
.catch(err => console.error('Database connection error:', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const indexRouter = require("./routes/indexRouter");
const productsRouter = require("./routes/productsRouter");
const adminRouter = require("./routes/adminRouter");

app.use("/", indexRouter);
app.use("/", productsRouter);
app.use("/", adminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
