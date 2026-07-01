const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

const STORAGE_KEY = 'taskflow.tasks';
let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTaskCount() {
  const remaining = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;
  const label = remaining === 1 ? 'task remaining' : 'tasks remaining';
  taskCount.textContent = `${remaining} ${label}`;
  clearCompletedBtn.disabled = completed === 0;
}

function createTaskItem(task) {
  const item = document.createElement('div');
  item.className = 'task-item fade-in';
  item.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const label = document.createElement('p');
  label.className = 'task-label';
  label.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => removeTask(task.id, item));

  item.append(checkbox, label, deleteBtn);
  if (task.completed) item.classList.add('completed');

  return item;
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => taskList.appendChild(createTaskItem(task)));
  updateTaskCount();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function removeTask(id, element) {
  element.classList.add('fade-out');
  element.addEventListener('animationend', () => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }, { once: true });
}

addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

loadTasks();
renderTasks();
