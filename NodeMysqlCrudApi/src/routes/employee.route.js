const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");

// get all emp
router.get("/", employeeController.getAllEmployees);

// get emp by id
router.get("/:id", employeeController.getEmployeeByID);

// create new emp
router.post("/", employeeController.createNewEmployee);

// update emp
router.put("/:id", employeeController.updateEmployee);

// delete emp
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;