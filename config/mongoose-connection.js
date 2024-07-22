const mongoose = require('mongoose');
const config = require("config");
const dbgr = require("debug")("development:mongoose");

// Correct MongoDB URI with the default port number
const mongoUri = "mongodb://127.0.0.1:27017/scatch";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(function() {
  console.log("Database connected successfully");
})
.catch(function(err) {
  console.error("Database connection error:", err);
});

module.exports = mongoose.connection;

