// ----- State -----
const STORAGE_KEY = "todo-tasks";
let tasks = loadTasks();     // array of { id, text, completed }
let currentFilter = "all";   // "all" | "active" | "completed"
let editingId = null;        // id of the task being edited, or null

// ----- Elements -----
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

// ----- localStorage -----
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []; // storage empty or corrupted
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ----- Task actions (each one changes state, saves, then re-draws) -----
function addTask(text) {
  const clean = text.trim();
  if (!clean) return;
  tasks.push({ id: Date.now(), text: clean, completed: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function startEdit(id) {
  editingId = id;
  render();
}

function saveEdit(id, newText) {
  const clean = newText.trim();
  const task = tasks.find((t) => t.id === id);
  if (task && clean) task.text = clean; // empty text keeps the old one
  editingId = null;
  saveTasks();
  render();
}

function cancelEdit() {
  editingId = null;
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

// ----- Build one task row -----
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task" + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  li.appendChild(checkbox);

  if (task.id === editingId) {
    // Edit mode: text box + save + cancel
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.text;
    editInput.maxLength = 100;
    li.appendChild(editInput);

    li.appendChild(makeButton("💾", "save"));
    li.appendChild(makeButton("✖️", "cancel"));
  } else {
    // Normal mode: text + edit + delete
    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text; // textContent is safe: it never runs HTML
    li.appendChild(span);

    li.appendChild(makeButton("✏️", "edit"));
    li.appendChild(makeButton("🗑️", "delete"));
  }

  return li;
}

function makeButton(label, action) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.dataset.action = action;
  return btn;
}

// ----- Draw everything on screen -----
function render() {
  // 1. Which tasks to show
  const visible = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  // 2. Rebuild the list
  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    if (tasks.length === 0) empty.textContent = "🌼 Nothing here yet. Add your first task!";
    else if (currentFilter === "active") empty.textContent = "🎉 No active tasks left!";
    else empty.textContent = "🌱 No completed tasks yet.";
    list.appendChild(empty);
  } else {
    visible.forEach((task) => list.appendChild(createTaskElement(task)));
  }

  // 3. Footer counter
  const remaining = tasks.filter((t) => !t.completed).length;
  if (tasks.length > 0 && remaining === 0) {
    countEl.textContent = "🎉 All done!";
  } else {
    countEl.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
  }

  // 4. Show "Clear completed" only when there is something to clear
  const hasCompleted = tasks.some((t) => t.completed);
  clearBtn.style.visibility = hasCompleted ? "visible" : "hidden";

  // 5. Highlight the active filter
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });

  // 6. Focus the edit box if one is open
  if (editingId !== null) {
    const editInput = list.querySelector(".edit-input");
    if (editInput) {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
  }
}

// ----- Events -----
form.addEventListener("submit", (e) => {
  e.preventDefault();          // stop the page from reloading
  addTask(input.value);
  input.value = "";
  input.focus();
});

// One listener on the whole list handles clicks for every task (event delegation)
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const li = btn.closest(".task");
  const id = Number(li.dataset.id);

  switch (btn.dataset.action) {
    case "edit":   startEdit(id); break;
    case "delete": deleteTask(id); break;
    case "save":   saveEdit(id, li.querySelector(".edit-input").value); break;
    case "cancel": cancelEdit(); break;
  }
});

list.addEventListener("change", (e) => {
  if (e.target.dataset.action === "toggle") {
    toggleTask(Number(e.target.closest(".task").dataset.id));
  }
});

// Enter saves, Escape cancels while editing
list.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("edit-input")) return;
  const id = Number(e.target.closest(".task").dataset.id);
  if (e.key === "Enter") saveEdit(id, e.target.value);
  if (e.key === "Escape") cancelEdit();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    editingId = null;
    render();
  });
});

clearBtn.addEventListener("click", clearCompleted);

// ----- Start -----
render();