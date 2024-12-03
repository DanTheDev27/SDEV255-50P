const apiBase = 'http://localhost:3000';

// Fetch courses and populate the list
async function fetchCourses(listElement) {
    try {
        const res = await fetch(`${apiBase}/courses`);
        const courses = res.ok ? await res.json() : [];

        if (listElement) {
            listElement.innerHTML = '<h3>Courses:</h3>';
            courses.forEach(course => {
                const div = document.createElement('div');
                div.className = 'item';
                div.textContent = `Teacher: ${course.teacher}, Course: ${course.course}`;
                listElement.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Fetch courses for dropdown
async function populateDropdown(selectElement) {
    try {
        const res = await fetch(`${apiBase}/courses`);
        const courses = res.ok ? await res.json() : [];
        selectElement.innerHTML = '';

        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = JSON.stringify(course);
            option.textContent = `${course.teacher} - ${course.course}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
    }
}

// Create a new course
async function createCourse(teacher, course, fetchCallback) {
    try {
        await fetch(`${apiBase}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teacher, course }),
        });
        if (fetchCallback) await fetchCallback();
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

// Initialize for index.html
function initIndex() {
    const courseForm = document.getElementById('create-course-form');
    const teacherInput = document.getElementById('teacher');
    const courseInput = document.getElementById('course');
    const coursesList = document.getElementById('courses-list');

    fetchCourses(coursesList);

    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createCourse(teacherInput.value, courseInput.value, () => fetchCourses(coursesList));
        teacherInput.value = '';
        courseInput.value = '';
    });
}

if (document.body.id === 'index-page') {
    initIndex();
}
