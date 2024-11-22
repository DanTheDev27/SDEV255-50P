const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

let teachers = [];
let courses = [];

// Simulated logged-in teacher
let loggedInTeacher = null;

// Middleware to set the currently logged-in teacher
app.use((req, res, next) => {
    if (!loggedInTeacher) {
        loggedInTeacher = teachers[0] || null; // Default to the first teacher if any
    }
    next();
});

// Teachers Endpoints
app.post('/teachers', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const teacher = { id: uuidv4(), name };
    teachers.push(teacher);
    res.status(201).json(teacher);
});

app.get('/teachers', (req, res) => {
    res.json(teachers);
});

// Courses Endpoints
app.post('/courses', (req, res) => {
    const { title, teacherId } = req.body;
    if (!title || !teacherId) return res.status(400).json({ error: 'Title and Teacher ID are required' });

    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const course = { id: uuidv4(), title, teacherId };
    courses.push(course);
    res.status(201).json(course);
});

app.get('/courses', (req, res) => {
    res.json(courses);
});

app.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const course = courses.find((c) => c.id === id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.title = title || course.title;
    res.json(course);
});

app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;

    // Initially allow all teachers to delete any course
    const courseIndex = courses.findIndex((c) => c.id === id);
    if (courseIndex === -1) return res.status(404).json({ error: 'Course not found' });

    const course = courses[courseIndex];

    // Restrict deletion to the teacher who created the course
    if (loggedInTeacher && loggedInTeacher.id !== course.teacherId) {
        return res.status(403).json({ error: 'Unauthorized to delete this course' });
    }

    courses.splice(courseIndex, 1);
    res.json({ message: 'Course deleted successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
