// Populate selected courses
function displaySelectedCourses() {
    const selectedList = document.getElementById('selected-courses-list');
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    selectedList.innerHTML = '<h3>Selected Courses:</h3>';

    selectedCourses.forEach((course, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            Teacher: ${course.teacher}, Course: ${course.course}
            <button onclick="deleteSelectedCourse(${index})">Delete</button>
        `;
        selectedList.appendChild(div);
    });
}

// Add a course to the local list
function addSelectedCourse(course) {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    selectedCourses.push(course);
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    displaySelectedCourses();
}

// Delete a course from the local list
function deleteSelectedCourse(index) {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    selectedCourses.splice(index, 1);
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    displaySelectedCourses();
}

// Initialize for courses.html
function initCoursesPage() {
    const selectForm = document.getElementById('select-course-form');
    const courseDropdown = document.getElementById('course-dropdown');

    populateDropdown(courseDropdown);
    displaySelectedCourses();

    selectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCourse = JSON.parse(courseDropdown.value);
        addSelectedCourse(selectedCourse);
    });
}

if (document.body.id === 'courses-page') {
    initCoursesPage();
}
