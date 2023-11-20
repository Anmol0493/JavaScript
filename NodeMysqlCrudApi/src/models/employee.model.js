const express = require("express");
var dbConnection = require("../../config/db.config");

var Employee = function(employee) {
    this.first_name = employee.first_name;
    this.last_name = employee.last_name;
    this.email = employee.email;
    this.phone = employee.phone;
    this.organization = employee.organization;
    this.designation = employee.designation;
    this.salary = employee.salary;
    this.status = employee.status ? employee.status : 1;
    this.created_at = new Date();
    this.updated_at = new Date();
}

// get all emps
Employee.getAllEmployees = (result) => {
    dbConnection.query("SELECT * FROM employees", (err, res) => {
        if(err) {
            console.log("Error while fetching employees", err);
            result(null, err);
        } else {
            console.log("Employees fetched successfully");
            result(null, res);
        }
    });
};

// get emp by id form DB
Employee.getEmployeeByID = (id, result) => {
    dbConnection.query("SELECT * FROM employees WHERE id=?", id, (err, res) => {
        if(err) {
            console.log("Error while fetching employee by id", err);
            result(null,err);
        } 
        if(res.length === 0) {
            console.log("Employee not found");
            return result("Employee not found", null);
        } else {
            console.log("Employee fetched successfully");
            result(null, res);
        }
    });
};

// create new emp
Employee.createNewEmployee = (employeeReqData, result) => {
    dbConnection.query("INSERT INTO employees SET ? ", employeeReqData, (err, res) => {
        if(err) {
            console.log("Error while inserting data", err);
            result(null, err);
        } else {
            console.log("Successfully created employee", res);
            result(null, res);
        }
    });
};

// update emp
Employee.updateEmployee = (id, employeeReqData, result) => {
    dbConnection.query(`UPDATE employees SET first_name = ?, last_name = ?,
    email = ?, phone = ?, organization = ?, designation = ?, salary = ?, status = ? WHERE id = ?`,
    [employeeReqData.first_name,employeeReqData.last_name,employeeReqData.email,
    employeeReqData.phone,employeeReqData.organization,employeeReqData.designation,
    employeeReqData.salary,employeeReqData.status, id], (err, res) => {
        if(err) {
            console.log("Error while update");
            result(null, err);
        } else {
            console.log("Update success");
            result(null, res);
        }
    });
};

// delete emp
Employee.deleteEmployee = (id, result) => {
    dbConnection.query("DELETE FROM employees WHERE id = ?", [id], (err, res) => {
        if (err) {
            console.log("Error in deleting", err);
            result(err, null);
        } else {
            console.log("Delete success", res);
            result(null, res);
        }
    });
};

module.exports = Employee;