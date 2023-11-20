const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
});

const collection = process.env.C_NAME;
const User = mongoose.model("Data", userSchema);

module.exports = User;
