const express = require("express");
const dbConnect = require("./Database_connect");

const router = express.Router();


// get all students
router.get("/students", (req, res) => {
    const query = "SELECT * FROM students";
    dbConnect.query(query, (error, result) => {
        if(error) {
            res.status(404).json({error: "error while fetching students"});
            console.log("error while fetching students");
        }
        else {
            res.json(result);
            console.log("students list fetched successfully");
        }
    });
});


// get all teachers
router.get("/teachers", (req, res) => {
    const query = "SELECT * FROM teachers";
    dbConnect.query(query, (error, result) => {
        if(error) {
            res.status(404).json({error: "error while fetching teachers"});
            console.log("error while fetching teachers");
        }
        else {
            res.json(result);
            console.log("teachers list fetched successfully");
        }
    });
});


// get a student by id
router.get("/students/:id", (req, res) => {
    const {id} = req.params;
    const query = `
        SELECT students.*, GROUP_CONCAT(teachers.name) AS teacher_names
        FROM students
        LEFT JOIN student_teacher ON students.id = student_teacher.student_id
        LEFT JOIN teachers ON student_teacher.teacher_id = teachers.id
        WHERE students.id = ?
        GROUP BY students.id`;
    dbConnect.query(query, [id], (error, result) => {
        if (error) {
            res.status(400).json({ error: "error while fetching the student" });
            console.log("error while fetching the student");
        } else {
            const student = result[0];
            if (student) {
                if (student.teacher_names !== null) {
                    student.teacher_names = student.teacher_names.split(",");
                } else {
                    student.teacher_names = [];
                }
                res.json(student);
                console.log("Student fetched successfully");
            } else {
                res.status(404).json({ error: "student not found" });
                console.log("student not found");
            }
        }
    });
});


// get a teacher by id
router.get("/teachers/:id", (req, res) => {
    const {id} = req.params;
    const query = `
        SELECT teachers.*, GROUP_CONCAT(students.name) AS student_names
        FROM teachers
        LEFT JOIN student_teacher ON teachers.id = student_teacher.teacher_id
        LEFT JOIN students ON student_teacher.student_id = students.id
        WHERE teachers.id = ?
        GROUP BY teachers.id`;
    dbConnect.query(query, [id], (error, result) => {
        if (error) {
            res.status(400).json({ error: "error while fetching the teacher" });
            console.log("error while fetching the teacher");
        } else {
            const teacher = result[0];
            if (teacher) {
                if (teacher.student_names !== null) {
                    teacher.student_names = teacher.student_names.split(",");
                } else {
                    teacher.student_names = [];
                }
                res.json(teacher);
                console.log("Teacher fetched successfully");
            } else {
                res.status(404).json({ error: "teacher not found" });
                console.log("teacher not found");
            }
        }
    });
});


// create a new student
router.post("/students", (req, res) => {    
    const {name, teacher_ids} = req.body;
    const studentQuery = "INSERT INTO students (name) VALUES (?)";
    dbConnect.query(studentQuery, [name], (error, studentResult) => {
        if(error) {
            res.status(400).json({error: "error while creating new student"});
            console.log("error while creating new student");
        } else {
            const studentId = studentResult.insertId;
            if(Array.isArray(teacher_ids) && teacher_ids.length > 0) {
                const studentTeacherValues = teacher_ids.map(teacherId => [studentId, teacherId]);
                const studentTeacherQuery = "INSERT INTO student_teacher (student_id, teacher_id) VALUES (?)";
                dbConnect.query(studentTeacherQuery, [studentTeacherValues], (error, studentTeacherResult) => {
                    if(error) {
                        res.status(400).json({error: "error while creating student-teacher associations"});
                        console.log("error while creating student-teacher associations");
                    } else {
                        res.json({
                            student_id: studentId,
                            teachers_ids: teacher_ids,
                            message: "New student and associated teachers created successfully"
                        });
                        console.log("New student and associated teachers created successfully");
                    }
                });
            } else {
                res.json({
                    student_id: studentId,
                    teachers_ids: teacher_ids,
                    message: "New student created successfully"
                });
                console.log("New student created successfully");
            }
        }
    });
});


// create a new teacher
router.post("/teachers", (req, res) => {    
    const {name, student_ids} = req.body;
    const teacherQuery = "INSERT INTO teachers (name) VALUES (?)";
    dbConnect.query(teacherQuery, [name], (error, teacherResult) => {
        if(error) {
            res.status(400).json({error: "error while creating new teacher"});
            console.log("error while creating new teacher");
        } else {
            const teacherId = teacherResult.insertId;
            if(Array.isArray(student_ids) && student_ids.length > 0) {
                const studentTeacherValues = student_ids.map(studentId => [studentId, teacherId]);
                const studentTeacherQuery = "INSERT INTO student_teacher (student_id, teacher_id) VALUES (?)";
                dbConnect.query(studentTeacherQuery, [studentTeacherValues], (error, studentTeacherResult) => {
                    if(error) {
                        res.status(400).json({error: "error while creating student-teacher associations"});
                        console.log("error while creating student-teacher associations");
                    } else {
                        res.json({
                            teacher_ids: teacherId,
                            students_ids: student_ids,
                            message: "New teacher and associated studnets created successfully"
                        });
                        console.log("New teacher and associated studnets created successfully");
                    }
                });
            } else {
                res.json({
                    teacher_id: teacherId,
                    students_ids: student_ids,
                    message: "New teacher created successfully"
                });
                console.log("New teacher created successfully");
            }
        }
    });
});


// update student info
router.put("/students/:id", (req, res) => {
    const {id} = req.params;
    const {name, teacher_ids} = req.body;
    const updateStudentQuery = "UPDATE students SET name = ? WHERE id = ?";
    const deleteAsQuery = "DELETE FROM student_teacher WHERE student_id = ?";
    const insertAsQuery = "INSERT INTO student_teacher (student_id,teacher_id) VALUES ?";

    dbConnect.query(updateStudentQuery, [name, id], (error, result) => {
        if(error) {
            res.status(400).json({error: "Error while updating student"});
            console.log("Error while updating student");
        } else {
            dbConnect.query(deleteAsQuery, [id], (error, asResult) => {
                if(error) {
                    res.status(400).json({error: "Error while deleting student associations"});
                    console.log("Error while deleting student associations");
                } else {
                    if(Array.isArray(teacher_ids) && teacher_ids.length > 0) {
                        const studentTeacherValues = teacher_ids.map(teacherId => [id, teacherId]);
                        dbConnect.query(insertAsQuery, [studentTeacherValues], (error, asInsertRes) => {
                            if(error){
                                res.status(400).json({error: "Error while creating student-teacher associations"});
                                console.log("Error while creating student-teacher associations");
                            } else {
                                res.json({message: "student-teacher associations updated successfully"});
                                console.log("student-teacher associations updated successfully");
                            }
                        });
                    } else {
                        res.json({message: "Student updated successfully"});
                        console.log("Student updated successfully");
                    }
                }
            });
        }
    });
});


// update teacher info
router.put("/teachers/:id", (req, res) => {
    const { id } = req.params;
    const { name, student_ids } = req.body;
    const updateTeacherQuery = "UPDATE teachers SET name = ? WHERE id = ?";
    const deleteAsQuery = "DELETE FROM student_teacher WHERE teacher_id = ?";
    const insertAsQuery = "INSERT INTO student_teacher (student_id, teacher_id) VALUES ?";

    dbConnect.query(updateTeacherQuery, [name, id], (error, result) => {
        if (error) {
            res.status(400).json({ error: "Error while updating teacher" });
            console.log("Error while updating teacher");
        } else {
            dbConnect.query(deleteAsQuery, [id], (error, asResult) => {
                if (error) {
                    res.status(400).json({ error: "Error while deleting teacher associations" });
                    console.log("Error while deleting teacher associations");
                } else {
                    if (Array.isArray(student_ids) && student_ids.length > 0) {
                        const studentTeacherValues = student_ids.map(studentId => [studentId, id]);
                        dbConnect.query(insertAsQuery, [studentTeacherValues], (error, asInsertRes) => {
                            if (error) {
                                res.status(400).json({ error: "Error while creating student-teacher associations" });
                                console.log("Error while creating student-teacher associations");
                            } else {
                                res.json({ message: "student-teacher associations updated successfully" });
                                console.log("student-teacher associations updated successfully");
                            }
                        });
                    } else {
                        res.json({ message: "Teacher updated successfully" });
                        console.log("Teacher updated successfully");
                    }
                }
            });
        }
    });
});




// delete student
router.delete("/students/:id", (req, res) => {
    const {id} = req.params;
    const deleteQuery = "DELETE FROM students WHERE id = ?";
    const deleteAsQuery = "DELETE FROM student_teacher WHERE student_id = ?";
    dbConnect.query(deleteAsQuery, [id], (error, asResult) => {
        if(error) {
            res.status(400).json({error: "Error while deleting student associations"});
            console.log("Error while deleting student associations");
        } else {
            dbConnect.query(deleteQuery, [id], (error, result) => {
                if (error) {
                    res.status(400).json({error: "Error while deleting student"});
                    console.log("Error while deleting student");
                } else {
                    res.json({message: "Student deleted successfully"});
                    console.log("Student deleted successfully");
                }
            });
        }
    });
});


// delete teacher
router.delete("/teachers/:id", (req, res) => {
    const {id} = req.params;
    const deleteQuery = "DELETE FROM teachers WHERE id = ?";
    const deleteAsQuery = "DELETE FROM student_teacher WHERE teacher_id = ?";
    dbConnect.query(deleteAsQuery, [id], (error, asResult) => {
        if(error) {
            res.status(400).json({error: "Error while deleting teacher associations"});
            console.log("Error while deleting teacher associations");
        } else {
            dbConnect.query(deleteQuery, [id], (error, result) => {
                if (error) {
                    res.status(400).json({error: "Error while deleting teacher"});
                    console.log("Error while deleting teacher");
                } else {
                    res.json({message: "teacher deleted successfully"});
                    console.log("teacher deleted successfully");
                }
            });
        }
    });
});


module.exports = router;