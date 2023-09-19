async function refreshTodos() {
    try {
        const response = await fetch('/todos');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        document.getElementById('todo-list').innerHTML = '';
        data.forEach((todo, index) => {
            document.getElementById('todo-list').insertAdjacentHTML('beforeend', `
            <li class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="mb-1">
                        <strong class="text-muted">Title: </strong>
                        <div contenteditable="false" id="title-${todo.id}" class="todo-title d-block">${todo.title}</div>
                    </div>
                    <div>
                        <strong class="text-muted">Description: </strong>
                        <div contenteditable="false" id="description-${todo.id}" class="todo-description d-block">${todo.description}</div>
                    </div>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm" onclick="toggleEdit(${todo.id})">Edit</button>
                    <button class="btn btn-success btn-sm" onclick="saveEdit(${todo.id})" style="display:none;">Save</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
            </li>            `);
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function toggleEdit(todoId) {
    const titleElement = document.getElementById('title-' + todoId);
    const descriptionElement = document.getElementById('description-' + todoId);
    const editButton = document.querySelector(`button[onclick="toggleEdit(${todoId})"]`);
    const saveButton = document.querySelector(`button[onclick="saveEdit(${todoId})"]`);

    if (titleElement.isContentEditable) {
        titleElement.contentEditable = "false";
        descriptionElement.contentEditable = "false";
        editButton.style.display = "inline-block";
        saveButton.style.display = "none";
    } else {
        titleElement.contentEditable = "true";
        descriptionElement.contentEditable = "true";
        editButton.style.display = "none";
        saveButton.style.display = "inline-block";
    }
}

async function saveEdit(todoId) {
    const newTitle = document.getElementById('title-' + todoId).innerText;
    const newDescription = document.getElementById('description-' + todoId).innerText;

    try {
        const response = await fetch('/todos/' + todoId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, description: newDescription }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        await refreshTodos();
        document.querySelector(`button[onclick="toggleEdit(${todoId})"]`).style.display = "inline-block";
        document.querySelector(`button[onclick="saveEdit(${todoId})"]`).style.display = "none";
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.getElementById('create-todo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    try {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        document.getElementById('todo-title').value = '';
        document.getElementById('todo-description').value = '';
        await refreshTodos();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});


async function deleteTodo(todoId) {
    try {
        const response = await fetch('/todos/' + todoId, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        await refreshTodos();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function searchTodo() {
    const todoId = document.getElementById('search-id').value;
    try {
        const response = await fetch('/todos/' + todoId);
        if (!response.ok) {
            document.getElementById('search-result').innerHTML = 'Todo not found.';
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        document.getElementById('search-result').innerHTML = `
            <strong>ID:</strong> ${data.id}<br>
            <strong>Title:</strong> ${data.title}<br>
            <strong>Description:</strong> ${data.description}
        `;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

refreshTodos();










