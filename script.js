const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

// Carregar tarefas do localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between p-2 border-t";

    const taskText = document.createElement("span");
    taskText.textContent = task;
    li.appendChild(taskText);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.className = "text-red-500";
    removeButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    li.appendChild(removeButton);

    taskList.appendChild(li);
  });
}

addTask.addEventListener("click", () => {
  const newTask = taskInput.value.trim();
  if (newTask !== "") {
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
});

renderTasks();
