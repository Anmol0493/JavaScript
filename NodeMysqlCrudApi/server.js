const express = require("express");
const bodyParser = require('body-parser')

// create express app
const app = express();

// server port
require('dotenv').config();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello world");
    console.log("site opened");
});

// import routes
const employeeRoutes = require("./src/routes/employee.route");

// create employee routes
app.use("/api/employees", employeeRoutes);

// port listening
app.listen(port, () => {
    console.log(`Server port listening ${port}`);
});