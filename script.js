// Function to fetch and display teachers from the database
function fetchTeachers() {
    const tableBody = document.querySelector('#teacher-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    fetch('api/get_teachers.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(teacher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.teacher_id}</td>
                    <td>${teacher.name}</td>
                    <td>${teacher.short_name}</td>
                    <td>${teacher.course_taught}</td>
                    <td>${teacher.course_code}</td>
                    <td>${teacher.dept}</td>
                    <td>${teacher.start_time}</td>
                    <td>${teacher.end_time}</td>
                    <td>${teacher.day}</td>
                    <td>${teacher.room_no}</td>
                    <td>${teacher.building_name}</td>
                    <td>
                        <button class="btn-edit" onclick="editTeacher(${teacher.teacher_id})">Edit</button>
                        <button class="btn-delete" onclick="deleteTeacher(${teacher.teacher_id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching teachers:', error);
        });
}

function searchTeachers() {
    const name = document.getElementById('search_name').value;
    const dept = document.getElementById('search_dept').value;
    const day = document.getElementById('search_day').value;

    const tableBody = document.querySelector('#teacher-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    fetch(`api/search_teachers.php?name=${name}&dept=${dept}&day=${day}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(teacher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.teacher_id}</td>
                    <td>${teacher.name}</td>
                    <td>${teacher.short_name}</td>
                    <td>${teacher.course_taught}</td>
                    <td>${teacher.course_code}</td>
                    <td>${teacher.dept}</td>
                    <td>${teacher.start_time}</td>
                    <td>${teacher.end_time}</td>
                    <td>${teacher.day}</td>
                    <td>${teacher.room_no}</td>
                    <td>${teacher.building_name}</td>
                    <td>
                        <button class="btn-edit" onclick="editTeacher(${teacher.teacher_id})">Edit</button>
                        <button class="btn-delete" onclick="deleteTeacher(${teacher.teacher_id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error searching teachers:', error);
        });
}

// Function to add or update a teacher
function saveTeacher() {
    const teacherId = document.getElementById('teacher_id').value;
    const name = document.getElementById('name').value;
    const shortName = document.getElementById('short_name').value;
    const course_taught = document.getElementById('course_taught').value;
    const course_code = document.getElementById('course_code').value;
    const dept = document.getElementById('dept').value; // Ensure the correct ID is used
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;
    const day = document.getElementById('day').value;
    const room_no = document.getElementById('room_no').value;
    const building_name = document.getElementById('building_name').value; // New attribute

    const url = teacherId ? 'api/update_teacher.php' : 'api/add_teacher.php';
    const method = teacherId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teacher_id: teacherId, name, short_name: shortName, course_taught, course_code, dept, start_time, end_time, day, room_no, building_name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Teacher saved successfully!');
            fetchTeachers(); // Refresh the teacher list
            document.getElementById('teacher-form').reset();
            document.getElementById('teacher_id').value = ''; // Clear the hidden input field
        } else {
            alert('Error saving teacher: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error saving teacher:', error);
    });
}

// Function to edit a teacher
function editTeacher(id) {
    fetch(`api/get_teacher.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('teacher_id').value = data.teacher_id;
            document.getElementById('name').value = data.name;
            document.getElementById('short_name').value = data.short_name;
            document.getElementById('course_taught').value = data.course_taught;
            document.getElementById('course_code').value = data.course_code;
            document.getElementById('dept').value = data.dept;
            document.getElementById('start_time').value = data.start_time;
            document.getElementById('end_time').value = data.end_time;
            document.getElementById('day').value = data.day;
            document.getElementById('room_no').value = data.room_no;
            document.getElementById('building_name').value = data.building_name; // New attribute
        })
        .catch(error => {
            console.error('Error fetching teacher:', error);
        });
}

// Function to delete a teacher
function deleteTeacher(id) {
    if (confirm("Are you sure you want to delete this teacher?")) {
        fetch('api/delete_teacher.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teacher_id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Teacher deleted successfully!');
                fetchTeachers();
            } else {
                alert('Error deleting teacher: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting teacher:', error);
        });
    }
}

// Function to clear all teacher data
function clearTeachers() {
    if (confirm("Are you sure you want to clear all teacher data?")) {
        fetch('api/clear_teachers.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('All teacher data cleared successfully!');
                fetchTeachers(); // Refresh the teacher list
            } else {
                alert('Error clearing teacher data: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error clearing teacher data:', error);
        });
    }
}

// Function to view teacher routine
function viewTeacherRoutine(teacherId) {
    window.location.href = `routine.html?teacher_id=${teacherId}`;
}

// Add event listener to the form submit button
document.getElementById('teacher-form').addEventListener('submit', function(event) {
    event.preventDefault();
    saveTeacher();
});

// Fetch initial teacher data on page load
fetchTeachers();