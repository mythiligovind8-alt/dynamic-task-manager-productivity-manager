// Get HTML elements
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("[data-filter]");

// Store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingId = null;

// Save tasks in LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found!</p>";
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const details = document.createElement("small");
        details.textContent =
            "Category: " + task.category +
            " | Due: " + (task.dueDate || "Not set");

        info.append(title, details);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        completeBtn.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {
            taskInput.value = task.title;
            category.value = task.category;
            dueDate.value = task.dueDate;
            editingId = task.id;
            addTaskBtn.textContent = "Update Task";
            taskInput.focus();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);

            if (editingId === task.id) {
                resetForm();
            }

            saveTasks();
            displayTasks();
        });

        actions.append(completeBtn, editBtn, deleteBtn);
        li.append(info, actions);
        taskList.appendChild(li);
    });
}

// Reset the form
function resetForm() {
    taskInput.value = "";
    category.value = "Work";
    dueDate.value = "";
    editingId = null;
    addTaskBtn.textContent = "Add Task";
}

// Add or update a task
function addOrUpdateTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    if (editingId !== null) {
        const task = tasks.find(item => item.id === editingId);

        if (task) {
            task.title = title;
            task.category = category.value;
            task.dueDate = dueDate.value;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            category: category.value,
            dueDate: dueDate.value,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    resetForm();
    displayTasks();
}

// Add button
addTaskBtn.addEventListener("click", addOrUpdateTask);

// Enter key support
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addOrUpdateTask();
    }
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        displayTasks();
    });
});

// Load saved tasks when the page opens
displayTasks();