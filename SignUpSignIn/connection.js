const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const connectedToDB = mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((error) => {
        console.error(error);
        process.exit();
    });

module.exports = { connectedToDB };
