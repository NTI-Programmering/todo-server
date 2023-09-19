async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function updateTodoList(todos) {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    todoList.insertAdjacentHTML(
      "beforeend",
      `
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
          </li>
      `
    );
  });
}

async function refreshTodos() {
  const data = await fetchData("/todos");
  if (data) {
    updateTodoList(data);
  }
}

function toggleEdit(todoId) {
  const titleElement = document.getElementById("title-" + todoId);
  const descriptionElement = document.getElementById("description-" + todoId);
  const editButton = document.querySelector(
    `button[onclick="toggleEdit(${todoId})"]`
  );
  const saveButton = document.querySelector(
    `button[onclick="saveEdit(${todoId})"]`
  );

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
  const newTitle = document.getElementById("title-" + todoId).innerText;
  const newDescription = document.getElementById(
    "description-" + todoId
  ).innerText;

  const data = await fetchData("/todos/" + todoId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle, description: newDescription }),
  });

  if (data) {
    await refreshTodos();
    document.querySelector(
      `button[onclick="toggleEdit(${todoId})"]`
    ).style.display = "inline-block";
    document.querySelector(
      `button[onclick="saveEdit(${todoId})"]`
    ).style.display = "none";
  }
}

document
  .getElementById("create-todo-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("todo-title").value;
    const description = document.getElementById("todo-description").value;

    const data = await fetchData("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (data) {
      document.getElementById("todo-title").value = "";
      document.getElementById("todo-description").value = "";
      await refreshTodos();
    }
  });

async function deleteTodo(todoId) {
  const data = await fetchData("/todos/" + todoId, { method: "DELETE" });

  if (data) {
    await refreshTodos();
  }
}

async function searchTodo() {
  const todoId = document.getElementById("search-id").value;

  const data = await fetchData("/todos/" + todoId);

  if (data) {
    document.getElementById("search-result").innerHTML = `
            <strong>ID:</strong> ${data.id}<br>
            <strong>Title:</strong> ${data.title}<br>
            <strong>Description:</strong> ${data.description}
        `;
  } else {
    document.getElementById("search-result").innerHTML = "Todo not found.";
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  refreshTodos();
});
