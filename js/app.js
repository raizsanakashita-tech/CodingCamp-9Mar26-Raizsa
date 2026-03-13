// Greeting and DateTime
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById('greeting');
    const userName = localStorage.getItem('userName') || '';
    
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    greetingEl.textContent = userName ? `${greeting}, ${userName}!` : greeting;
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US');
    document.getElementById('datetime').textContent = `${dateStr} - ${timeStr}`;
}

document.getElementById('userName').addEventListener('change', (e) => {
    localStorage.setItem('userName', e.target.value);
    updateGreeting();
});

document.getElementById('userName').value = localStorage.getItem('userName') || '';

// Focus Timer
let timerInterval = null;
let timeLeft = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            stopTimer();
            alert('Time is up!');
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 25;
    timeLeft = minutes * 60;
    updateTimerDisplay();
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
document.getElementById('timerMinutes').addEventListener('change', resetTimer);

// To-Do List
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''}`;
        
        if (todo.editing) {
            li.innerHTML = `
                <input type="text" class="todo-edit-input" value="${todo.text}" data-index="${index}">
                <div class="todo-actions">
                    <button class="save-btn" onclick="saveTodoEdit(${index})">Save</button>
                    <button class="cancel-btn" onclick="cancelTodoEdit(${index})">Cancel</button>
                </div>
            `;
        } else {
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo(${index})">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="edit-btn" onclick="editTodo(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
                </div>
            `;
        }
        
        todoList.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text) {
        todos.push({ text, done: false, editing: false });
        input.value = '';
        saveTodos();
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
}

function editTodo(index) {
    todos[index].editing = true;
    renderTodos();
    const input = document.querySelector(`input[data-index="${index}"]`);
    if (input) input.focus();
}

function saveTodoEdit(index) {
    const input = document.querySelector(`input[data-index="${index}"]`);
    const text = input.value.trim();
    
    if (text) {
        todos[index].text = text;
        todos[index].editing = false;
        saveTodos();
        renderTodos();
    }
}

function cancelTodoEdit(index) {
    todos[index].editing = false;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

document.getElementById('addTodoBtn').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Quick Links
let links = JSON.parse(localStorage.getItem('links')) || [];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const linksList = document.getElementById('linksList');
    linksList.innerHTML = '';
    
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <button class="link-delete" onclick="deleteLink(${index})">×</button>
            <a href="${link.url}" target="_blank">${link.name}</a>
        `;
        linksList.appendChild(div);
    });
}

function addLink() {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    
    if (name && url) {
        links.push({ name, url });
        nameInput.value = '';
        urlInput.value = '';
        saveLinks();
        renderLinks();
    }
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

document.getElementById('addLinkBtn').addEventListener('click', addLink);

// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');
const isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Initialize
updateGreeting();
updateDateTime();
updateTimerDisplay();
renderTodos();
renderLinks();
setInterval(updateDateTime, 1000);
