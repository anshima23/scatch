const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");

const dotenv = require("dotenv");
dotenv.config();

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {})
.then(() => console.log('Database connected successfully'))
.catch(err => console.error('Database connection error:', err));


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
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users",usersRouter);
app.use("/products", productsRouter);

app.use((err, req, res, next) => { res.status(500).send('Something broke!');});

app.listen(3000);
