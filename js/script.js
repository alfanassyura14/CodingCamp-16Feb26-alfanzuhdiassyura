const todoForm = document.getElementById('todoForm');
const todoNameInput = document.getElementById('todoName');
const todoDateInput = document.getElementById('todoDate');
const todoDeadlineInput = document.getElementById('todoDeadline');
const todoStatusInput = document.getElementById('todoStatus');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');

const todos = [];

function formatDate(value) {
	const date = new Date(value);
	return date.toLocaleDateString('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});
}

function statusClassName(status) {
	return `status-${status.replace(/\s+/g, '-')}`;
}

function renderTodoDisplayMode(item, todo) {
	const main = document.createElement('div');
	main.className = 'todo-main';

	const meta = document.createElement('div');
	const title = document.createElement('h3');
	title.className = 'todo-title';
	title.textContent = todo.name;

	const date = document.createElement('p');
	date.className = 'todo-date';
	date.textContent = `Date: ${formatDate(todo.date)}`;

	const deadline = document.createElement('p');
	deadline.className = 'todo-date';
	deadline.textContent = `Deadline: ${formatDate(todo.deadline)}`;

	const status = document.createElement('span');
	status.className = `status-badge ${statusClassName(todo.status)}`;
	status.textContent = todo.status;

	meta.appendChild(title);
	meta.appendChild(date);
	meta.appendChild(deadline);
	main.appendChild(meta);
	main.appendChild(status);

	const actions = document.createElement('div');
	actions.className = 'todo-actions';

	const editButton = document.createElement('button');
	editButton.type = 'button';
	editButton.className = 'btn btn-edit';
	editButton.textContent = 'Update';
	editButton.addEventListener('click', () => {
		todo.isEditing = true;
		renderTodos();
	});

	const deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.className = 'btn btn-delete';
	deleteButton.textContent = 'Delete';
	deleteButton.addEventListener('click', () => {
		const index = todos.findIndex((entry) => entry.id === todo.id);

		if (index !== -1) {
			todos.splice(index, 1);
			renderTodos();
		}
	});

	actions.appendChild(editButton);
	actions.appendChild(deleteButton);
	item.appendChild(main);
	item.appendChild(actions);
}

function renderTodoEditMode(item, todo) {
	const editGrid = document.createElement('div');
	editGrid.className = 'edit-grid';

	const nameInput = document.createElement('input');
	nameInput.type = 'text';
	nameInput.value = todo.name;

	const dateInput = document.createElement('input');
	dateInput.type = 'date';
	dateInput.value = todo.date;

	const deadlineInput = document.createElement('input');
	deadlineInput.type = 'date';
	deadlineInput.value = todo.deadline;

	const statusInput = document.createElement('select');
	['pending', 'on progress', 'done', 'cancel'].forEach((value) => {
		const option = document.createElement('option');
		option.value = value;
		option.textContent = value;
		option.selected = value === todo.status;
		statusInput.appendChild(option);
	});

	const actions = document.createElement('div');
	actions.className = 'todo-actions';

	const saveButton = document.createElement('button');
	saveButton.type = 'button';
	saveButton.className = 'btn btn-save';
	saveButton.textContent = 'Save';
	saveButton.addEventListener('click', () => {
		const nextName = nameInput.value.trim();
		const nextDate = dateInput.value;
		const nextDeadline = deadlineInput.value;
		const nextStatus = statusInput.value;

		if (!nextName || !nextDate || !nextDeadline) {
			return;
		}

		todo.name = nextName;
		todo.date = nextDate;
		todo.deadline = nextDeadline;
		todo.status = nextStatus;
		todo.isEditing = false;
		renderTodos();
	});

	const cancelButton = document.createElement('button');
	cancelButton.type = 'button';
	cancelButton.className = 'btn btn-cancel';
	cancelButton.textContent = 'Cancel';
	cancelButton.addEventListener('click', () => {
		todo.isEditing = false;
		renderTodos();
	});

	actions.appendChild(saveButton);
	actions.appendChild(cancelButton);

	editGrid.appendChild(nameInput);
	editGrid.appendChild(dateInput);
	editGrid.appendChild(deadlineInput);
	editGrid.appendChild(statusInput);
	item.appendChild(editGrid);
	item.appendChild(actions);
}

function renderTodos() {
	todoList.innerHTML = '';

	if (todos.length === 0) {
		emptyState.style.display = 'block';
		return;
	}

	emptyState.style.display = 'none';

	todos.forEach((todo) => {
		const item = document.createElement('li');
		item.className = 'todo-item';

		if (todo.isEditing) {
			renderTodoEditMode(item, todo);
		} else {
			renderTodoDisplayMode(item, todo);
		}

		todoList.appendChild(item);
	});
}

todoForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const name = todoNameInput.value.trim();
	const date = todoDateInput.value;
	const deadline = todoDeadlineInput.value;
	const status = todoStatusInput.value;

	if (!name || !date || !deadline || !status) {
		return;
	}

	todos.push({
		id: Date.now() + Math.floor(Math.random() * 1000),
		name,
		date,
		deadline,
		status,
		isEditing: false
	});

	todoForm.reset();
	todoStatusInput.value = 'pending';
	renderTodos();
});

renderTodos();
