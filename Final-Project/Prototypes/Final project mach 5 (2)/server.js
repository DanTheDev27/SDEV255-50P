const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Utility: Load courses from the db.json file
function loadCourses() {
    if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    }
    return { courses: [] };
}

// Utility: Save courses to the db.json file
function saveCourses(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Route: Homepage (Create Courses)
app.get('/', (req, res) => {
    res.render('index');
});

// Route: Courses page (List and manage courses)
app.get('/courses', (req, res) => {
    const data = loadCourses();
    res.render('courses', { courses: data.courses });
});

// Route: Update course page
app.get('/courses/update/:id', (req, res) => {
    const data = loadCourses();
    const courseId = parseInt(req.params.id, 10);
    const course = data.courses[courseId];

    if (!course) {
        return res.status(404).send('Course not found');
    }

    res.render('update', { course, id: courseId });
});

// Route: Handle updates to a course
app.post('/courses/update', (req, res) => {
    const data = loadCourses();
    const { id, teacher, course } = req.body;
    const courseId = parseInt(id, 10);

    if (data.courses[courseId]) {
        data.courses[courseId] = { teacher, course };
        saveCourses(data);
    }

    res.redirect('/courses');
});

// Route: Handle creation of a new course
app.post('/courses', (req, res) => {
    const { teacher, course } = req.body;
    if (teacher && course) {
        const data = loadCourses();
        data.courses.push({ teacher, course });
        saveCourses(data);
    }
    res.redirect('/');
});

// Route: Handle deletion of a course
app.post('/courses/delete', (req, res) => {
    const { index } = req.body;
    const data = loadCourses();
    const courseIndex = parseInt(index, 10);

    if (courseIndex >= 0 && courseIndex < data.courses.length) {
        data.courses.splice(courseIndex, 1);
        saveCourses(data);
    }

    res.redirect('/courses');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
