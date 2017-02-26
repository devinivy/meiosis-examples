/*
These functions return Promises and use setTimeout to simulate async behaviour. This makes the
example more realistic. Indeed, a real-world application would make async AJAX requests to a
backend server.
*/
const STORAGE_KEY = "meiosis-todomvc";

const findIndex = function(todos, todoId) {
  let index = -1;

  for (let i = 0, t = todos.length; i < t; i++) {
    if (todos[i].id === todoId) {
      index = i;
      break;
    }
  }
  return index;
};

const replaceTodoAtIndex = function(todos, todo, index) {
  return todos.slice(0, index).concat([todo]).concat(todos.slice(index + 1));
};

const deleteTodoAtIndex = function(todos, index) {
  return todos.slice(0, index).concat(todos.slice(index + 1));
};

const loadAll = function() {
  return new Promise(resolve =>
    setTimeout(() => resolve(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")), 10));
};

const saveAll = function(todos) {
  return new Promise(resolve =>
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      resolve();
    }, 10));
};

export const todoStorage = {
  loadAll,
  saveAll,
  saveTodo: function(todo) {
    return new Promise(resolve =>
      loadAll().then(todos => {
        const id = parseInt(todo.id, 10);

        if (id > 0) {
          const index = findIndex(todos, id);
          todo.completed = todos[index].completed;
          todos = replaceTodoAtIndex(todos, todo, index);
        }
        else {
          todo = { title: todo.title, id: new Date().getTime(), completed: false };
          todos = todos.concat([todo]);
        }
        saveAll(todos).then(() => resolve(todo));
      }));
  },
  deleteTodoId: function(todoId) {
    return new Promise((resolve, reject) =>
      loadAll().then(todos => {
        const index = findIndex(todos, todoId);

        if (index >= 0) {
          todos = deleteTodoAtIndex(todos, index);
          saveAll(todos).then(() => resolve());
        }
        else {
          reject();
        }
      }));
  },
  setCompleted: function(id, completed) {
    return new Promise((resolve, reject) =>
      loadAll().then(todos => {
        const index = findIndex(todos, id);

        if (index >= 0) {
          const todo = todos[index];
          todo.completed = completed;
          todos = replaceTodoAtIndex(todos, todo, index);
          saveAll(todos).then(() => resolve());
        }
        else {
          reject();
        }
      }));
  },
  setAllCompleted: function(completed) {
    return new Promise(resolve =>
      loadAll().then(todos => {
        todos.forEach(function(todo) {
          todo.completed = completed;
        });
        saveAll(todos).then(() => resolve());
      }));
  },
  clearCompleted: function() {
    return new Promise(resolve =>
      loadAll().then(todos => {
        const updatedTodos = [];

        for (let i = 0, t = todos.length; i < t; i++) {
          if (!todos[i].completed) {
            updatedTodos.push(todos[i]);
          }
        }
        saveAll(updatedTodos).then(() => resolve(updatedTodos));
      }));
  },
  filter: function(by) {
    const completedSelected = by === "completed";
    const filterBy = todo => (!!todo.completed) === completedSelected;

    return new Promise(resolve =>
      loadAll().then(todos => {
        const filteredTodos = todos.filter(filterBy);
        resolve(filteredTodos);
      }));
  }
};