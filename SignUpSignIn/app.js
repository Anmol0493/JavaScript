const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.static("static"));

app.use(express.json()); // parse requests of content-type - application/json

app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const ejs = require("ejs");
app.set("view engine", "ejs");

// DB connection
const connectedToDB = require("./connection.js");

connectedToDB;

// Routes
const { checkUser } = require("./jwt.js");
app.get("*", checkUser);

const router = require("./routes.js");
app.use("/", router);

// Server Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/` + ".".repeat(20));
});
