const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" folder
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Load and save courses data
const loadCourses = () => JSON.parse(fs.readFileSync('db.json', 'utf-8'));
const saveCourses = (data) => fs.writeFileSync('db.json', JSON.stringify(data, null, 2));

// Render the index page
app.get('/', (req, res) => {
    const data = loadCourses();
    res.render('index', { courses: data.courses });
});

// Render the courses page
app.get('/courses', (req, res) => {
    const data = loadCourses();
    res.render('courses', { courses: data.courses });
});


// Add a new course
app.post('/courses', (req, res) => {
    const data = loadCourses();
    const newCourse = { teacher: req.body.teacher, course: req.body.course };
    data.courses.push(newCourse);
    saveCourses(data);
    res.redirect('/');
});

// Delete a course
app.post('/courses/delete', (req, res) => {
    const data = loadCourses();
    data.courses = data.courses.filter((_, index) => index !== parseInt(req.body.index));
    saveCourses(data);
    res.redirect('/courses');
});



// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
