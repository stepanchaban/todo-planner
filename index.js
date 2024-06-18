const ToDoList = [];

function getDomElement() {
  return {
    blockWithToDo: document.getElementById('list-container'),
    inputForPushedToDo: document.getElementById('input-box'),
    buttonCreate: document.querySelector('.main__form-btn'),
    task: document.getElementById('task')
  };
}

function deleteToDo(id) {
  const index = ToDoList.findIndex(item => item.id == id);
  if (index !== -1) {
    ToDoList.splice(index, 1);
    saveInStore(ToDoList);
  }
  return ToDoList;
}

function getLocalStore() {
  const data = localStorage.getItem('ToDoList');
  return data ? JSON.parse(data) : [];
}

function saveInStore(db) {
  localStorage.setItem('ToDoList', JSON.stringify(db));
}

function setToDo(value) {
  const addToDoObject = {
    id: `${ToDoList.length + 1}`,
    name: value,
    status: false
  };
  ToDoList.push(addToDoObject);
  saveInStore(ToDoList);
  return ToDoList;
}

function updateStatus(id) {
  const index = ToDoList.findIndex(el => el.id === id);
  if (index !== -1) {
    ToDoList[index].status = !ToDoList[index].status;
    saveInStore(ToDoList);
  }
}

function addToDoHTML(todo) {
  return `<li class="task-item" id="${todo.id}" draggable="true">
    <div class="checkbox-container">
      <input type="checkbox" id="round-checkbox-${
        todo.id
      }" class="round-checkbox" ${todo.status ? 'checked' : ''} />
      <label for="round-checkbox-${
        todo.id
      }" class="round-checkbox-label"></label>
    </div>
    <div class="task-container">
      <div id="task-${todo.id}" class="task ${
    todo.status ? 'completed' : ''
  }" contenteditable="true">${todo.name}</div>
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

function loadContent(content) {
  const { blockWithToDo } = getDomElement();
  blockWithToDo.innerHTML = content;
}

function renderContent() {
  if (ToDoList.length === 0) {
    loadContent(withoutToDoHTML);
  } else {
    const listToDos = ToDoList.map(addToDoHTML).join('');
    loadContent(listToDos);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const { inputForPushedToDo, blockWithToDo } = getDomElement();
  const form = document.getElementById('todo-form');

  const storedToDos = getLocalStore();
  if (storedToDos) {
    ToDoList.push(...storedToDos);
    renderContent();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (inputForPushedToDo.value.trim() === '') {
      alert('Ты должен вписать задачу!');
      return;
    }
    setToDo(inputForPushedToDo.value.trim());
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
    } else if (target.classList.contains('round-checkbox')) {
      const id = target.id.split('-')[2];
      updateStatus(id);
      renderContent();
      updateTaskStats();
    } else if (target.classList.contains('edit')) {
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
  const totalTasks = ToDoList.length;
  const completedTasks = ToDoList.filter(todo => todo.status).length;
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
    const todo = ToDoList.find(todo => todo.id == id);
    todo.name = taskElement.textContent.trim();
    saveInStore(ToDoList);
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
      ToDoList.find(todo => todo.id == item.id)
    );
    ToDoList.length = 0;
    ToDoList.push(...updatedList);
    saveInStore(ToDoList);
  }
}

function handleDragEnd() {
  draggedElement = null;
}
