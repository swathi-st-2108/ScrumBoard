document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const crudSection = document.getElementById('crudSection');
    const taskForm = document.getElementById('TaskForm');
    const bucketList = document.getElementById('bucketList');
    const boardSection = document.getElementById('boardSection');

    function checkLogin() {
        const role = sessionStorage.getItem("role");
        if (role === 'admin' && sessionStorage.getItem("loggedInUser")) {
            loginSection.style.display = "none";
            crudSection.style.display = "block";
            loadTasks(); 
        } else if (role === 'user' && sessionStorage.getItem("loggedInUser")) {
            loginSection.style.display = "none";
            crudSection.style.display = "none";
            boardSection.style.display = "block";
            loadTasks();
        } else {
            loginSection.style.display = "block";
            crudSection.style.display = "none";
        }
    }

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

        if (taskName && assignedTo && dueDate) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ name: taskName, assignedTo, dueDate });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
            taskForm.reset();
        } else {
            alert('Please fill in all fields');
        }
    });

    function loadTasks() {
        bucketList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach((task) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name} <br> ${task.assignedTo} <br> ${task.dueDate}</td>
                <td></td>
                <td></td>
            `;
            bucketList.appendChild(row);
        }); 
    }
    checkLogin();
});
