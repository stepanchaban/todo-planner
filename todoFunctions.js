// export const ToDoList = [];

// export function getDomElement() {
//   const blockWithToDo = document.getElementById('list-container');
//   const inputForPushedToDo = document.getElementById('input-box');
//   const buttonCreate = document.querySelector('.main__form-btn');
//   const task = document.getElementById('task');
//   return {
//     blockWithToDo,
//     inputForPushedToDo,
//     buttonCreate,
//     task
//   };
// }

// export function deleteToDo(id) {
//   const index = ToDoList.findIndex(item => item.id == id);
//   if (index !== -1) {
//     ToDoList.splice(index, 1);
//     saveInStore(ToDoList);
//   }
//   return ToDoList;
// }

// export function getLocalStore() {
//   const data = localStorage.getItem('ToDoList');
//   return data ? JSON.parse(data) : [];
// }

// export function saveInStore(db) {
//   localStorage.setItem('ToDoList', JSON.stringify(db));
// }

// export function setToDo(value) {
//   const addToDoObject = {
//     id: `${ToDoList.length + 1}`,
//     name: value,
//     status: false
//   };
//   ToDoList.push(addToDoObject);
//   saveInStore(ToDoList);
//   return ToDoList;
// }

// export function updateStatus(id) {
//   const index = ToDoList.findIndex(el => el.id === id);
//   if (index !== -1) {
//     ToDoList[index].status = !ToDoList[index].status;
//     saveInStore(ToDoList);
//   }
// }

// export function addToDo(todo) {
//   return `<li class="task-item" id="${todo.id}" draggable="true">
//     <div class="checkbox-container">
//       <input type="checkbox" id="round-checkbox-${
//         todo.id
//       }" class="round-checkbox" ${todo.status ? 'checked' : ''} />
//       <label for="round-checkbox-${
//         todo.id
//       }" class="round-checkbox-label"></label>
//     </div>
//     <div class="task-container">
//       <div id="task-${todo.id}" class="task ${
//     todo.status ? 'completed' : ''
//   }" contenteditable="true">${todo.name}</div>
//     </div>
//     <div class="actions">
//       <button class="edit">Edit</button>
//       <img id="trash-button-${
//         todo.id
//       }" class="trash-button" src="img/trash.svg" alt="trash" />
//     </div>
//   </li>`;
// }

// export const withoutToDo = `
//     <li id="tasks-message">
//         <img class="main__info-img" src="img/Clipboard.svg" alt="Clipboard" />
//         <p class="main__info-text1">У вас еще нет зарегистрированных задач</p>
//         <p class="main__info-text2">Создавайте задачи и организуйте свои дела</p>
//     </li>
// `;

// export function loadContent(content) {
//   const domElements = getDomElement();
//   domElements.blockWithToDo.innerHTML = content;
// }

// export function renderContent() {
//   if (ToDoList.length === 0) {
//     loadContent(withoutToDo);
//   } else {
//     let listToDos = '';
//     ToDoList.forEach(item => {
//       listToDos += addToDo(item);
//     });
//     loadContent(listToDos);
//   }
// }
