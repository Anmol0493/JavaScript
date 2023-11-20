const Employee = require("../models/employee.model");

// get emp list
exports.getAllEmployees = (req, res) => {
    Employee.getAllEmployees((err, employees) => {
        if(err) {
            res.send(err);
        } else {
            console.log("Employees' list is ", employees);
            res.send(employees)
        }
    });
};

// get emp by id
exports.getEmployeeByID = (req, res) => {
    Employee.getEmployeeByID(req.params.id, (err, employee) => {
        if(err) {
            console.log(err);
            res.status(404).json({success: false, message: "Employee not found"});
        } else {
            console.log("Employee is", employee);
            res.send(employee)
        }
    });
};

// create new employee
exports.createNewEmployee = (req, res) => {
    const employeeReqData = new Employee(req.body);
    console.log(employeeReqData);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.send(400).send({success: false, message: "Fill all details"});
    } else {
        Employee.createNewEmployee(employeeReqData, (err, employee) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ success: true, message: "New employee created", employee });
            }
            }
        );
    };
};

// update emp
exports.updateEmployee = (req, res) => {
    const employeeReqData = new Employee(req.body);
    console.log(employeeReqData);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.send(400).send({success: false, message: "Fill all details"});
    } else {
        Employee.updateEmployee(req.params.id, employeeReqData, (err, employee) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ success: true, message: "Update success", employee });
            }
        });
    }
};

// delete emp
exports.deleteEmployee = (req, res) => {
    Employee.deleteEmployee(req.params.id, (err, employee) => {
        if (err) {
            res.send(err);
        } else {
            if (employee.affectedRows === 0) {
                res.status(404).json({ success: false, message: "Employee not found" });
            } else {
                res.json({ success: true, message: "Deleted successfully" });
            }
        }
    });
};