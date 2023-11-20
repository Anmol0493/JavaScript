const mysql = require("mysql");
require("dotenv").config();

const dbConnect = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

dbConnect.connect((error) => {
    if(error) {
        return error;
    } else {
        console.log("Connected to Database");
    }
})

module.exports = dbConnect;