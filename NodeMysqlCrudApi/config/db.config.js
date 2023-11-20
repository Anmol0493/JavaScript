const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "password0100",
    database: "node_mysql_crud_db"
});

dbConnection.connect((error) => {
    if(error) throw error;
    console.log("Connected to database successfully");
});

module.exports = dbConnection;