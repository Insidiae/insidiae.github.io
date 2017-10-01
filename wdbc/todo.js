function addTodo() {
    //Add an todo to list
    var newTodo = prompt("Enter a new todo");
    todoList.push(newTodo);
    console.log(newTodo + " added to list!");
}

function deleteTodo() {
    //Delete an item by index
    var index = prompt("Enter the index of the todo you want to delete");
    todoList.splice(index, 1);
    console.log("Todo deleted!")
}

function listTodos() {
    //List all todos
    console.log("**********");
    todoList.forEach(function (todo, todoIndex) {
        console.log(todoIndex + ": " + todo);
    });
    console.log("**********");
}


var input = "";
var todoList = [];
while (input !== "quit") {
    input = prompt("What would you like to do?");
    if (input === "new") {
        addTodo();
    } else if (input === "delete") {
        deleteTodo();
    } else if (input === "list") {
        listTodos();
    }
}
console.log("Quitting app...");
