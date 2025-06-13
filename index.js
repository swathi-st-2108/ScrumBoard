document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const crudSection = document.getElementById('crudSection');
    const taskForm = document.getElementById('TaskForm');
    const bucketList = document.getElementById('bucketList');
    const boardSection = document.getElementById('boardSection');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkLogin() {
        const role = sessionStorage.getItem("role");
        const isLoggedIn = sessionStorage.getItem("loggedInUser");

        if (isLoggedIn && role === "admin") {
            loginSection.style.display = "none";
            crudSection.style.display = "block";
            boardSection.style.display = "block";
            loadTasks();
        } else if (isLoggedIn && role === "user") {
            loginSection.style.display = "none";
            crudSection.style.display = "none";
            boardSection.style.display = "block";
            loadTasks();
        } else {
            loginSection.style.display = "block";
            crudSection.style.display = "none";
            boardSection.style.display = "none";

            if (sessionStorage.getItem("justLoggedOut")) {
                alert("You have been logged out. Please fill the login details again.");
                sessionStorage.removeItem("justLoggedOut");
            }
        }
    }

    logoutBtn.addEventListener("click", () => {
        sessionStorage.setItem("justLoggedOut", "true");
        sessionStorage.clear();
        location.reload();
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const validUsers = [
            { username: 'Swathi', password: '1234', role: 'admin' },
            { username: 'Keerthana', password: '5678', role: 'admin' },
            { username: 'Deva', password: '0000', role: 'user' },
            { username: 'Jeeva', password: '1111', role: 'user' }
        ];

        const isValid = validUsers.some(user =>
            user.username === username &&
            user.password === password &&
            user.role === role
        );

        if (isValid) {
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('role', role);
            checkLogin();
        } else {
            alert('Invalid username or password');
        }
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const assignedTo = document.getElementById('developer').value;
        const dueDate = document.getElementById('storyTime').value;
        const currentUser = sessionStorage.getItem("loggedInUser"); 

if (taskName && assignedTo && dueDate) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({
        name: taskName,
        assignedTo,
        dueDate,
        status: "todo",
        createdBy: currentUser 
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    taskForm.reset();
}
    });
function loadTasks() {
    bucketList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const role = sessionStorage.getItem("role");
    const currentUser = sessionStorage.getItem("loggedInUser");

    const todoCol = document.createElement('td');
    const inProgressCol = document.createElement('td');
    const doneCol = document.createElement('td');

    let hasVisibleTasks = false;

    tasks.forEach((task, index) => {
        const isUserTask = role === "user" && task.assignedTo === currentUser;
        const isAdminTask = role === "admin" && task.createdBy === currentUser;

        if (!(isUserTask || isAdminTask)) {
            return;
        }

        hasVisibleTasks = true;

        const taskHTML = `
            <div class="mb-2 border p-2 bg-light text-dark rounded">
                <strong>${task.name}</strong><br>
                Assigned to: ${task.assignedTo}<br>
                Due: ${task.dueDate}<br>
                ${role === "user" ? `Assigned by: ${task.createdBy}<br>` : ""}
                ${getMoveButtons(role, task.status, index)}
            </div>
        `;

        if (task.status === "todo") {
            todoCol.innerHTML += taskHTML;
        } else if (task.status === "progress") {
            inProgressCol.innerHTML += taskHTML;
        } else if (task.status === "done") {
            doneCol.innerHTML += taskHTML;
        }
    });

    if (hasVisibleTasks) {
        const row = document.createElement('tr');
        row.appendChild(todoCol);
        row.appendChild(inProgressCol);
        row.appendChild(doneCol);
        bucketList.appendChild(row);
    } else if (role === "user") {
        const row = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.colSpan = 3;
        messageCell.className = 'text-center text-muted py-4';
        messageCell.innerText = "No tasks assigned to you.";
        row.appendChild(messageCell);
        bucketList.appendChild(row);
    }
}

    checkLogin();
});

function getMoveButtons(role, status, index) {
    let buttons = "";

    if (role === "user") {
        if (status === "todo") {
            buttons += `<button class="btn btn-sm btn-success mt-1 " onclick="moveTask(${index}, 'progress')">Move to In Progress</button>`;
        } else if (status === "progress") {
            buttons += `<button class="btn btn-sm btn-success mt-1" onclick="moveTask(${index}, 'done')">Move to Done</button>`;
        }
    }

    if (role === "admin" && status === "done") {
        buttons += `<button class="btn btn-sm btn-secondary mt-1" onclick="moveTask(${index}, 'progress')">Move to In Progress</button>`; 
        buttons += `<button class="btn btn-sm btn-danger mt-1 ms-2" onclick="deleteTask(${index})">Accept the Task</button>`;
    }

    return buttons;
}

function moveTask(index, newStatus) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks[index]) {
        tasks[index].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks[index]) {
        tasks.splice(index, 1); 
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.dispatchEvent(new Event('DOMContentLoaded')); 
    }
}
