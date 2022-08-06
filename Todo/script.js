class Todo {
    static idCounter = localStorage.maxId ? localStorage.maxId : 0;
    static editItemIndex;
    constructor(title, description) {
        this.id = ++Todo.idCounter;
        this.title = title;
        this.description = description;
        localStorage.maxId = this.id;

        let date = new Date();
        this.date = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    }
}

ShowList();


//Function to add a entity in localStorage
function SetStorage() {
    let title = "";
    if (document.getElementById("input").value)
        title = document.getElementById("input").value;
    if (title.trim() == "") {
        alert("Title cannot be empty");
        return undefined;
    }
    let description = document.getElementById("description").value;
    let todo = new Todo(title, description);
    let storage = [];
    if (localStorage.data != null) {
        storage = JSON.parse(localStorage.data);
    }

    storage.push(JSON.stringify(todo));
    localStorage.data = JSON.stringify(storage);
    Add_li(todo.id, todo.title, todo.description,todo.date);
    document.getElementById("input").value = "";
    document.getElementById("description").value = "";
}

//Function to get parsed data from localStorage
function GetStorage() {
    if (localStorage.data) {
        let storage = JSON.parse(localStorage['data']);
        let data = [];
        for (let item of storage) {
            data.push(JSON.parse(item));
        }
        return data;
    }
    return false;
}

// Function to add li in ul
function Add_li(id, title, description,date) {
    let li = document.createElement("li");
    let titleNode = document.createTextNode(title + "  " + description);
    li.appendChild(titleNode);
    li.setAttribute("id", 'l' + id);
    document.getElementById("myUL").appendChild(li);

    let span2 = document.createElement("SPAN");
    let edit = document.createTextNode("\u270E");
    span2.className = "edit";
    span2.setAttribute("id", 'e' + id);
    span2.setAttribute("onClick", "EditTodo(this.id)")
    span2.appendChild(edit);
    li.appendChild(span2);

    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7"); //  \u270E
    span.className = "close";
    span.setAttribute("id", 'dl' + id);
    span.setAttribute("onClick", "DeleteTodo(this.id)")
    span.appendChild(txt);
    li.appendChild(span);

    let span3 = document.createElement("SPAN");
    let dateText = document.createTextNode(date);
    span3.className = "date";
    span3.appendChild(dateText);
    li.appendChild(span3);
}

// Function to Show li list from localStorage
function ShowList() {
    document.getElementById("myUL").innerHTML = "";
    let data = GetStorage();
    if (data) {
        data.forEach((item) => {
            Add_li(item.id, item.title, item.description,item.date);
        })
    }
}

//Funcion to delete a entity from localStorage
function DeleteTodo(id) {
    let storage;
    storage = JSON.parse(localStorage.data);
    let indexToRemove = undefined;
    for (let i = 0; i < storage.length; i++) {
        let obj = JSON.parse(storage[i]);
        if ('dl' + obj.id == id) {
            indexToRemove = i;
            break;
        }
    }
    storage.splice(indexToRemove, 1);
    localStorage.data = JSON.stringify(storage);
    ShowList();
}

//Funcion to edit a entity from localStorage
function EditTodo(id) {
    let storage;
    storage = JSON.parse(localStorage.data);
    for (let i = 0; i < storage.length; i++) {
        let obj = JSON.parse(storage[i]);
        if ('e' + obj.id == id) {
            Todo.indexToEdit = i;
            document.getElementById("input").value = obj.title;
            document.getElementById("description").value = obj.description;
            document.getElementById("editBtn").removeAttribute("hidden");
            document.getElementById("addBtn").setAttribute("hidden","");
            break;
        }
    }

}

function EditStorage() {
    let storage;
    storage = JSON.parse(localStorage.data);
    let editObj = JSON.parse(storage[Todo.indexToEdit]) ;
    editObj.title = document.getElementById("input").value;
    editObj.description = document.getElementById("description").value;
    storage[Todo.indexToEdit] = JSON.stringify(editObj);
    localStorage.data = JSON.stringify(storage);
    ShowList();
    document.getElementById("editBtn").setAttribute("hidden","");
    document.getElementById("addBtn").removeAttribute("hidden");
    document.getElementById("input").value = "";
    document.getElementById("description").value = "";
}