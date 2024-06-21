const LOCAL_STORAGE_KEY = 'toDoList';
const toDoList = [];

function getBlockWithToDo() {
  return document.getElementById('list-container');
}

function getInputForPushedToDo() {
  return document.getElementById('input-box');
}

function getButtonCreate() {
  return document.querySelector('.main__form-btn');
}

function getTask() {
  return document.getElementById('task');
}

function deleteToDo(id) {
  const index = toDoList.findIndex(item => item.id === id);
  if (index !== -1) {
    toDoList.splice(index, 1);
    saveToDoListInStore(toDoList);
  }
  return toDoList;
}

function getStoredToDoList() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error parsing local storage data:', e);
    return [];
  }
}

function saveToDoListInStore(toDoList) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDoList));
}

function addNewToDo(taskName) {
  const newToDo = {
    id: `${Date.now()}`,
    taskName,
    isCompleted: false
  };
  toDoList.push(newToDo);
  saveToDoListInStore(toDoList);
  return toDoList;
}

function toggleToDoStatus(id) {
  const index = toDoList.findIndex(el => el.id === id);
  if (index !== -1) {
    toDoList[index].isCompleted = !toDoList[index].isCompleted;
    saveToDoListInStore(toDoList);
  }
}

function addToDoHTML(todo) {
  return `<li class="task-item" id="${todo.id}" draggable="true">
    <div class="checkbox-container">
      <input type="checkbox" id="round-checkbox-${
        todo.id
      }" class="round-checkbox" ${todo.isCompleted ? 'checked' : ''} />
      <label for="round-checkbox-${
        todo.id
      }" class="round-checkbox-label"></label>
    </div>
    <div class="task-container">
      <div id="task-${todo.id}" class="task ${
    todo.isCompleted ? 'completed' : ''
  }" contenteditable="true">${todo.taskName}</div>
    </div>
    <div class="actions">
      <button class="edit">Edit</button>
      <img id="trash-button-${
        todo.id
      }" class="trash-button" src="img/trash.svg" alt="trash" />
    </div>
  </li>`;
}

const withoutToDoHTML = `
    <li id="tasks-message">
        <img class="main__info-img" src="img/Clipboard.svg" alt="Clipboard" />
        <p class="main__info-text1">У вас еще нет зарегистрированных задач</p>
        <p class="main__info-text2">Создавайте задачи и организуйте свои дела</p>
    </li>
`;

function renderToDoList(content) {
  const blockWithToDo = getBlockWithToDo();
  blockWithToDo.innerHTML = content;
}

function renderContent() {
  if (toDoList.length === 0) {
    renderToDoList(withoutToDoHTML);
  } else {
    const listToDos = toDoList.map(addToDoHTML).join('');
    renderToDoList(listToDos);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputForPushedToDo = getInputForPushedToDo();
  const blockWithToDo = getBlockWithToDo();
  const form = document.getElementById('todo-form');

  const storedToDos = getStoredToDoList();
  if (storedToDos.length > 0) {
    toDoList.push(...storedToDos);
    renderContent();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (inputForPushedToDo.value.trim() === '') {
      alert('Ты должен вписать задачу!');
      return;
    }
    addNewToDo(inputForPushedToDo.value.trim());
    inputForPushedToDo.value = '';
    renderContent();
    updateTaskStats();
  });

  blockWithToDo.addEventListener('click', event => {
    const { target } = event;
    if (target.classList.contains('trash-button')) {
      const id = target.id.split('-')[2];
      deleteToDo(id);
      renderContent();
      updateTaskStats();
    }

    if (target.classList.contains('round-checkbox')) {
      const id = target.id.split('-')[2];
      toggleToDoStatus(id);
      renderContent();
      updateTaskStats();
    }

    if (target.classList.contains('edit')) {
      handleEditTask(target);
    }
  });

  blockWithToDo.addEventListener('dragstart', handleDragStart);
  blockWithToDo.addEventListener('dragover', handleDragOver);
  blockWithToDo.addEventListener('drop', handleDrop);
  blockWithToDo.addEventListener('dragend', handleDragEnd);

  updateTaskStats();
  renderContent();
});

function updateTaskStats() {
  const totalTasks = toDoList.length;
  const completedTasks = toDoList.filter(todo => todo.isCompleted).length;
  document.getElementById('total-tasks').textContent = totalTasks;
  document.getElementById('completed-tasks').textContent = completedTasks;
}

function handleEditTask(editButton) {
  const taskElement = editButton.closest('.task-item').querySelector('.task');
  if (editButton.innerText === 'Edit') {
    taskElement.removeAttribute('readonly');
    taskElement.focus();
    editButton.innerText = 'Save';
  } else {
    taskElement.setAttribute('readonly', true);
    const id = taskElement.id.split('-')[1];
    const todo = toDoList.find(todo => todo.id == id);
    todo.taskName = taskElement.textContent.trim();
    saveToDoListInStore(toDoList);
    editButton.innerText = 'Edit';
  }
}

let draggedElement;

function handleDragStart(event) {
  draggedElement = event.target;
  event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
  event.preventDefault();
  const target = event.target.closest('.task-item');
  if (target && draggedElement !== target) {
    const allItems = Array.from(target.parentNode.children);
    const draggedIndex = allItems.indexOf(draggedElement);
    const targetIndex = allItems.indexOf(target);

    if (draggedIndex < targetIndex) {
      target.after(draggedElement);
    } else {
      target.before(draggedElement);
    }

    const updatedList = Array.from(target.parentNode.children).map(item =>
      toDoList.find(todo => todo.id == item.id)
    );
    toDoList.length = 0;
    toDoList.push(...updatedList);
    saveToDoListInStore(toDoList);
  }
}

function handleDragEnd() {
  draggedElement = null;
}
