// API Base URL
const apiBase = 'http://localhost:3000';

// Default teachers
const defaultTeachers = [
    { id: '1', name: 'Dr. Smith' },
    { id: '2', name: 'Prof. Johnson' }
];

// Utility: Populate default teachers
function addDefaultTeachers(selectElement) {
    defaultTeachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        selectElement.appendChild(option);
    });
}

// Fetch teachers and populate both dropdowns
async function fetchTeachers() {
    try {
        const res = await fetch(`${apiBase}/teachers`);
        const teachers = res.ok ? await res.json() : [];

        // Clear both dropdowns
        const teacherSelect = document.getElementById('teacher-select');
        const teacherDropdown = document.getElementById('teacher-dropdown');
        teacherSelect.innerHTML = '';
        teacherDropdown.innerHTML = '';

        // Add default teachers to both dropdowns
        addDefaultTeachers(teacherSelect);
        addDefaultTeachers(teacherDropdown);

        // Add fetched teachers to both dropdowns
        teachers.forEach(teacher => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = teacher.id;
            option2.value = teacher.id;
            option1.textContent = teacher.name;
            option2.textContent = teacher.name;
            teacherSelect.appendChild(option1);
            teacherDropdown.appendChild(option2);
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
    }
}

// Fetch courses and update both the course list and localStorage
async function fetchCourses(listElement) {
    try {
        const res = await fetch(`${apiBase}/courses`);
        const courses = res.ok ? await res.json() : [];

        // Update localStorage
        localStorage.setItem('courses', JSON.stringify(courses));

        // Update the course list
        if (listElement) {
            listElement.innerHTML = '<h3>Courses:</h3>';
            courses.forEach(course => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    ${course.title} <strong>(Teacher ID: ${course.teacherId})</strong>
                    <button onclick="deleteCourse('${course.id}')">Delete</button>
                `;
                listElement.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Create a new teacher
async function createTeacher(name, fetchCallback) {
    try {
        await fetch(`${apiBase}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (fetchCallback) await fetchCallback();
    } catch (error) {
        console.error('Error creating teacher:', error);
    }
}

// Create a new course
async function createCourse(title, teacherId, fetchCallback) {
    try {
        await fetch(`${apiBase}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, teacherId }),
        });

        // Update localStorage
        const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const newCourse = { title, teacherId, id: Date.now() }; // Simulate unique ID
        storedCourses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(storedCourses));

        if (fetchCallback) await fetchCallback();
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

// Delete a course
async function deleteCourse(courseId) {
    try {
        await fetch(`${apiBase}/courses/${courseId}`, { method: 'DELETE' });
        await fetchCourses(document.getElementById('courses-list'));
    } catch (error) {
        console.error('Error deleting course:', error);
    }
}

// Populate courses in courses.html
function populateCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const coursesList = document.getElementById('courses-container');
    coursesList.innerHTML = '<h3>Courses:</h3>';

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = `${course.title} (Teacher ID: ${course.teacherId})`;
        coursesList.appendChild(div);
    });
}

// Initialize for index.html
function initIndex() {
    const teacherForm = document.getElementById('create-teacher-form');
    const courseForm = document.getElementById('create-course-form');
    const teacherNameInput = document.getElementById('teacher-name');
    const courseTitleInput = document.getElementById('course-title');
    const teacherSelect = document.getElementById('teacher-select');
    const teachersList = document.getElementById('teachers-list');
    const coursesList = document.getElementById('courses-list');

    // Populate teachers and courses
    fetchTeachers(teacherSelect, teachersList);
    fetchCourses(coursesList);

    // Handle teacher creation
    teacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createTeacher(teacherNameInput.value, () => fetchTeachers(teacherSelect, teachersList));
        teacherNameInput.value = '';
    });

    // Handle course creation
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createCourse(courseTitleInput.value, teacherSelect.value, () => fetchCourses(coursesList));
        courseTitleInput.value = '';
    });
}

// Initialize for courses.html
function initCourses() {
    populateCourses();
}

// Detect page and initialize
if (document.body.id === 'index-page') {
    initIndex();
} else if (document.body.id === 'courses-page') {
    initCourses();
}
