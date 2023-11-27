const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const shareButton = document.getElementById("shareTasks");
const sharedLinkInput = document.getElementById("sharedLink");
const shareLinkContainer = document.getElementById("shareLink");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between p-2 border-t draggable";
    li.setAttribute("draggable", true);
    li.dataset.index = index;

    const taskText = document.createElement("span");
    taskText.textContent = task;
    li.appendChild(taskText);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "space-x-2";

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "text-blue-500";
    editButton.addEventListener("click", () => {
      const updatedTask = prompt("Editar a tarefa:", task);
      if (updatedTask !== null) {
        tasks[index] = updatedTask;
        saveTasks();
        renderTasks();
      }
    });

    buttonsDiv.appendChild(editButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.className = "text-red-500";
    removeButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    buttonsDiv.appendChild(removeButton);

    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const fromIndex = e.dataTransfer.getData("text/plain");
  const toIndex = e.target.dataset.index;

  // Troca a posição dos itens na array "tasks"
  [tasks[fromIndex], tasks[toIndex]] = [tasks[toIndex], tasks[fromIndex]];

  saveTasks();
  renderTasks();
}

// Adicione eventos de arrastar e soltar aos itens da lista
document.addEventListener("dragstart", handleDragStart);
document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);
shareButton.addEventListener("click", () => {
  const sharedData = { tasks };
  const sharedLink = `${window.location.href.split("?")[0]}?data=${btoa(
    JSON.stringify(sharedData)
  )}`;
  sharedLinkInput.value = sharedLink;
  shareLinkContainer.classList.remove("hidden");
});

function loadSharedTasks() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get("data");
  if (sharedData) {
    try {
      const decodedData = atob(sharedData);
      const sharedTasks = JSON.parse(decodedData);
      tasks.length = 0;
      tasks.push(...sharedTasks.tasks);
      saveTasks();
      renderTasks();
    } catch (error) {
      console.error("Erro ao carregar tarefas compartilhadas:", error);
    }
  }
}
function addTaskHandler() {
  const newTask = taskInput.value.trim();
  if (newTask !== "") {
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
}

addTask.addEventListener("click", addTaskHandler);

taskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTaskHandler();
  }
});

addTask.addEventListener("click", () => {
  const newTask = taskInput.value.trim();
  if (newTask !== "") {
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
});

const shareIcon = document.getElementById("shareIcon");

shareIcon.addEventListener("click", () => {
  shareLinkContainer.classList.toggle("hidden");
});

loadSharedTasks();

renderTasks();
