const express = require('express');

const app = express();
const PORT = 3000;


app.use(express.json());

let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },

    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },

    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

function validateEnrollment(data) {

    const requiredFields = [
        "studentName",
        "courseCode",
        "courseName",
        "semester",
        "attendance"
    ];

    for (let field of requiredFields) {

        if (data[field] === undefined ||
            data[field] === null ||
            data[field] === "") {

            return "All fields are required";
        }
    }

    if (
        typeof data.studentName !== "string" ||
        typeof data.courseCode !== "string" ||
        typeof data.courseName !== "string" ||
        data.studentName.trim() === "" ||
        data.courseCode.trim() === "" ||
        data.courseName.trim() === ""
    ) {
        return "Name and course fields must be non-empty strings";
    }

    if (
        typeof data.attendance !== "number" ||
        data.attendance < 0 ||
        data.attendance > 100
    ) {
        return "Attendance must be a number between 0 and 100";
    }

    if (
        typeof data.semester !== "number" ||
        !Number.isInteger(data.semester) ||
        data.semester <= 0
    ) {
        return "Semester must be a positive integer";
    }

    return null;
}


app.get('/api/enrollments', (req, res) => {

    res.status(200).json(enrollments);

});


app.post('/api/enrollments', (req, res) => {

    const error = validateEnrollment(req.body);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    const newEnrollment = {

        id: Math.max(...enrollments.map(e => e.id), 0) + 1,

        studentName: req.body.studentName.trim(),
        courseCode: req.body.courseCode.trim(),
        courseName: req.body.courseName.trim(),
        semester: req.body.semester,
        attendance: req.body.attendance

    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);

});


app.get('/api/enrollments/:id', (req, res) => {

    const id = Number(req.params.id);

    const enrollment = enrollments.find(e => e.id === id);

    if (!enrollment) {

        return res.status(404).json({
            message: "Enrollment not found"
        });

    }

    res.status(200).json(enrollment);

});

app.put('/api/enrollments/:id', (req, res) => {

    const id = Number(req.params.id);

    const enrollment = enrollments.find(e => e.id === id);

    if (!enrollment) {

        return res.status(404).json({
            message: "Enrollment not found"
        });

    }

    const error = validateEnrollment(req.body);

    if (error) {

        return res.status(400).json({
            message: error
        });

    }

    enrollment.studentName = req.body.studentName.trim();
    enrollment.courseCode = req.body.courseCode.trim();
    enrollment.courseName = req.body.courseName.trim();
    enrollment.semester = req.body.semester;
    enrollment.attendance = req.body.attendance;

    res.status(200).json(enrollment);

});

app.delete('/api/enrollments/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Enrollment not found"
        });

    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: "Enrollment deleted successfully"
    });

});

app.get('/api/enrollments/filter', (req, res) => {

    const semester = req.query.semester;

    if (semester === undefined) {

        return res.status(400).json({
            message: "Semester query parameter is required"
        });

    }

    const filteredEnrollments = enrollments.filter(
        e => String(e.semester) === semester
    );

    res.status(200).json(filteredEnrollments);

});

app.get('/api/enrollments/low-attendance', (req, res) => {

    const lowAttendance = enrollments.filter(
        e => e.attendance < 75
    );

    res.status(200).json(lowAttendance);

});

app.listen(PORT, () => { //server starte
    console.log(`Server running at http://localhost:${PORT}`);

});