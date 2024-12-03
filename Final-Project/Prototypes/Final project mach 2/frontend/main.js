const apiBase = 'http://localhost:3000'; // Base URL for JSON Server

const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.render('index.html');
});


// Populate the course dropdown in selectcourse.html
async function populateCourseDropdown() {
    const coursesResponse = await fetch(`${apiBase}/courses`);
    const teachersResponse = await fetch(`${apiBase}/teachers`);

    const courses = await coursesResponse.json();
    const teachers = await teachersResponse.json();

    const dropdown = document.getElementById('course-select');
    dropdown.innerHTML = ''; // Clear existing options

    courses.forEach(course => {
        const teacher = teachers.find(t => t.id === course.teacherId);
        const option = document.createElement('option');
        option.value = `${course.title}|${teacher ? teacher.name : 'Unknown'}`;
        option.textContent = `${course.title} (Teacher: ${teacher ? teacher.name : 'Unknown'})`;
        dropdown.appendChild(option);
    });

    if (courses.length === 0) {
        const noDataOption = document.createElement('option');
        noDataOption.textContent = 'No courses available';
        dropdown.appendChild(noDataOption);
    }
}

// Add course-teacher combination to localStorage from selectcourse.html
function confirmCourseSelection() {
    const dropdown = document.getElementById('course-select');
    const selectedValue = dropdown.value;

    if (selectedValue === '' || selectedValue === 'No courses available') {
        alert('Please select a valid course.');
        return;
    }

    const confirmedCourses = JSON.parse(localStorage.getItem('confirmedCourses')) || [];
    confirmedCourses.push(selectedValue);
    localStorage.setItem('confirmedCourses', JSON.stringify(confirmedCourses));

    alert('Course successfully confirmed!');
}

// Display confirmed courses in courses.html
function displayConfirmedCourses() {
    const confirmedCourses = JSON.parse(localStorage.getItem('confirmedCourses')) || [];
    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';

    if (confirmedCourses.length === 0) {
        coursesList.innerHTML = '<p>No courses added yet.</p>';
        return;
    }

    confirmedCourses.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.innerHTML = `
            <p>${course}</p>
            <button onclick="deleteConfirmedCourse(${index})">Delete</button>
        `;
        coursesList.appendChild(courseDiv);
    });
}

// Delete a course from courses.html
function deleteConfirmedCourse(index) {
    const confirmedCourses = JSON.parse(localStorage.getItem('confirmedCourses')) || [];
    confirmedCourses.splice(index, 1);
    localStorage.setItem('confirmedCourses', JSON.stringify(confirmedCourses));
    displayConfirmedCourses(); // Refresh the course list
}

// Event listener for adding a teacher or course in index.html
if (document.getElementById('index-page')) {
    document.getElementById('create-teacher-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const teacherName = document.getElementById('teacher-name').value;
        if (!teacherName) {
            alert('Please enter a teacher name.');
            return;
        }

        await fetch(`${apiBase}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teacherName }),
        });

        alert('Teacher added successfully!');
        document.getElementById('teacher-name').value = ''; // Clear the field
    });

    document.getElementById('create-course-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseTitle = document.getElementById('course-title').value;
        if (!courseTitle) {
            alert('Please enter a course title.');
            return;
        }

        await fetch(`${apiBase}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: courseTitle }),
        });

        alert('Course added successfully!');
        document.getElementById('course-title').value = ''; // Clear the field
    });
}

// Event listeners for selectcourse.html
if (document.getElementById('select-course-page')) {
    populateCourseDropdown();
    document.getElementById('confirm-course-btn').addEventListener('click', confirmCourseSelection);
}

// Display confirmed courses on courses.html
if (document.getElementById('courses-page')) {
    displayConfirmedCourses();
}
