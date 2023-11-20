const express = require("express");
const app = express();
require("dotenv").config();

const router = require("./routes");
const bodyParser = require("body-parser");

// server port
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Welcome");
    console.log("working");
});

// routes
app.use("/api", router);

// listen to server port
app.listen(port, () => {console.log(`Server is listening on ${port}`);})