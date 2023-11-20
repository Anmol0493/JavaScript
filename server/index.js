const express = require("express");
const Joi = require("joi");
const errorHandler = require('./errorHandler');

require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];


// http get method
app.get("/", (req, res) => {
    res.send("Welcome");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    try {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) throw new Error("Course not found for this id");
        res.send(course);
    } catch (error) {
        errorHandler(res, 404, error.message);
    }
});


// http post method
app.post("/api/courses", (req, res) => {
    try {
        const {error} = validateCourse(req.body);
        if (error) throw new Error(error.details[0].message);

        const course = {
            id: courses.length + 1,
            name: req.body.name
        };
        courses.push(course);
        res.send(course);
    } catch (error) {
        errorHandler(res, 400, error.message);
    }
});


// http put method
app.put("/api/courses/:id", (req, res) => {
    try {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) throw new Error("Course not found for this id");

        const {error} = validateCourse(req.body);
        if (error) throw new Error(error.details[0].message);

        course.name = req.body.name;
        res.send(course);
    } catch (error) {
        errorHandler(res, 400, error.message);
    }
});


// http delete method
app.delete("/api/courses/:id", (req, res) => {
    try {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) throw new Error("Course not found for this id");

        const index = courses.indexOf(course);
        courses.splice(index, 1);

        res.send(courses);
    } catch (error) {
        errorHandler(res, 404, error.message);
    }
});


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}