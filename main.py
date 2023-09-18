from flask import Flask, request, jsonify, abort, render_template
import os

app = Flask(__name__)
todos = []


@app.route("/")
def index():
    return render_template("index.html", todos=todos)


@app.route("/test")
def test():
    return jsonify({"message": "Welcome to the TODO API"})


@app.route("/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)


@app.route("/todos/<int:id>", methods=["GET"])
def get_todo_by_id(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    return jsonify(todo)


@app.route("/todos", methods=["POST"])
def create_todo():
    new_todo = {
        "id": len(todos) + 1,
        "title": request.json["title"],
        "description": request.json.get("description", ""),
    }
    todos.append(new_todo)
    return jsonify(new_todo), 201


@app.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    todo.update(request.json)
    return jsonify(todo)


@app.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    todos.remove(todo)
    return jsonify(message="Todo deleted"), 200


if __name__ == "__main__":
    app.run(debug=True, port=os.getenv("PORT", default=3000))
