from flask import Flask, request, jsonify, abort
import os

todo_server = Flask(__name__)
todos = []


@todo_server.route("/")
def index():
    return jsonify({"message": "Welcome to the TODO API"})


@todo_server.route("/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)


@todo_server.route("/todos/<int:id>", methods=["GET"])
def get_todo_by_id(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    return jsonify(todo)


@todo_server.route("/todos", methods=["POST"])
def create_todo():
    new_todo = {"id": len(todos) + 1, **request.json}
    todos.append(new_todo)
    return jsonify(new_todo), 201


@todo_server.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    todo.update(request.json)
    return jsonify(todo)


@todo_server.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = next((todo for todo in todos if todo["id"] == id), None)
    if todo is None:
        abort(404)
    todos.remove(todo)
    return "", 204


if __name__ == "__main__":
    todo_server.run(debug=True, port=os.getenv("PORT", default=3000))
