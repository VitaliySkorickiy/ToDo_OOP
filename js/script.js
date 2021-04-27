class Todo {
  constructor(form, input, todolist, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todolist = document.querySelector(todolist);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todolist.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML(
      'beforeend',
      `
          <span class="text-todo">${todo.value}</span>
          <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
          </div>
    `
    );

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todolist.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();

    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
      this.input.value = '';
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(keyItem) {
    this.todoData.delete(keyItem);
    this.render();
  }

  completedItem(keyItem) {
    this.todoData.get(keyItem).completed = !this.todoData.get(keyItem).completed;
    this.render();
  }

  handler() {
    const todoContainer = document.querySelector('.todo-container');
    todoContainer.addEventListener('click', (e) => {
      const target = e.target;

      if (target.matches('.todo-complete')) {
        this.completedItem(target.closest('.todo-item').key);
      }

      if (target.matches('.todo-remove')) {
        this.deleteItem(target.closest('.todo-item').key);
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
