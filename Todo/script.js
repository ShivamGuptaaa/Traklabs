class Todo {
    static idCounter = localStorage.maxId ? localStorage.maxId : 0;
    static editItemIndex;
    static editItemIsArchived = false;
    constructor(title, description) {
        this.id = ++Todo.idCounter;
        this.title = title;
        this.description = description;
        localStorage.maxId = this.id;

        this.date = GetCurrentDateTime();
    }
}

ShowList();
//Get current time and date
function GetCurrentDateTime() {
    let date = new Date();
    return date.getHours() + ":" + date.getMinutes() + " - " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

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
    Add_li(todo.id, todo.title, todo.description, todo.date);
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
function Add_li(id, title, description, date, archived = false) {
    if (localStorage.data) {
        let s = JSON.parse(localStorage.data);
        if (s.length == 1) {
            document.getElementById("myUL").innerHTML = "";
            document.getElementById("control").hidden = false;
        }
    }
    let li = document.createElement("li");
    let titleNode = document.createTextNode(title + "  " + description);
    li.appendChild(titleNode);
    li.setAttribute("id", 'l' + id);
    if (archived) {
        li.className = "archived";
        document.getElementById("archivedUL").appendChild(li);
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    if (id !== 0) {
        // <input type="checkbox" name="foo" value="bar1"> Bar 1<br/>.
        let inp = document.createElement("input");
        inp.type = "checkbox";
        inp.className = "select";
        inp.setAttribute("id", 'cb' + id);
        li.appendChild(inp);

        let span2 = document.createElement("SPAN");
        let edit = document.createTextNode("\u270E");
        span2.className = "edit";
        span2.setAttribute("id", 'e' + id);
        if (archived)
            span2.setAttribute("onClick", "EditTodo(this.id,true)")
        else
            span2.setAttribute("onClick", "EditTodo(this.id)")
        span2.appendChild(edit);
        li.appendChild(span2);

        let span = document.createElement("SPAN");
        let txt = document.createTextNode("\u00D7"); //  \u270E
        span.className = "close";
        span.setAttribute("id", 'dl' + id);
        if (archived)
            span.setAttribute("onClick", "DeleteTodo(this.id,true)")
        else
            span.setAttribute("onClick", "DeleteTodo(this.id)")
        span.appendChild(txt);
        li.appendChild(span);

        let span3 = document.createElement("SPAN");
        let dateText = document.createTextNode(date);
        span3.className = "date";
        span3.appendChild(dateText);
        li.appendChild(span3);
    }
}

// Function to Show li list from localStorage
function ShowList() {
    let storage = [];
    if (localStorage.data)
        storage = JSON.parse(localStorage.data);
    let deletedData = [];
    if (localStorage.deletedData)
        deletedData = JSON.parse(localStorage.deletedData)
    if (storage.length != 0 || deletedData.length != 0)
        document.getElementById("control").hidden = false;
    document.getElementById("myUL").innerHTML = "";
    let data = GetStorage();
    if (data.length !== 0 && data) {

        document.getElementById("control").hidden = false;
        data.forEach((item) => {
            Add_li(item.id, item.title, item.description, item.date);
        })
    }
    else {
        Add_li(0, "Nothing To Show!", 'Use "Add" to add note', "");
    }
}

//Funcion to delete a entity from localStorage
function DeleteTodo(id, archived = false) {
    let storage;
    storage = archived ? JSON.parse(localStorage.archivedData) : JSON.parse(localStorage.data);
    let indexToRemove = undefined;
    let deletedData = [];
    if (localStorage.deletedData) {
        deletedData = JSON.parse(localStorage.deletedData);
    }
    for (let i = 0; i < storage.length; i++) {
        let obj = JSON.parse(storage[i]);
        if ('dl' + obj.id == id) {
            indexToRemove = i;
            deletedData.push(JSON.stringify(obj));
            break;
        }
    }
    storage.splice(indexToRemove, 1);
    if (storage.length == 0) {
        document.getElementById("control").hidden = true;
    }
    if (archived) {
        localStorage.archivedData = JSON.stringify(storage);
        HideArchive();
        ShowArchive();
    }
    else {
        localStorage.deletedData = JSON.stringify(deletedData);
        localStorage.data = JSON.stringify(storage);
        ShowList();
    }
}

//Funcion to edit a entity from localStorage
function EditTodo(id, archived = false) {
    let storage;
    if (archived) {
        storage = JSON.parse(localStorage.archivedData);
        Todo.editItemIsArchived = true;
    }
    else {
        storage = JSON.parse(localStorage.data);
    }
    for (let i = 0; i < storage.length; i++) {
        let obj = JSON.parse(storage[i]);
        if ('e' + obj.id == id) {
            Todo.indexToEdit = i;
            document.getElementById("input").value = obj.title;
            document.getElementById("description").value = obj.description;
            document.getElementById("editBtn").removeAttribute("hidden");
            document.getElementById("addBtn").setAttribute("hidden", "");
            break;
        }
    }

}

//function to edit localStorage data
function EditStorage() {
    let storage;
    storage = Todo.editItemIsArchived ? JSON.parse(localStorage.archivedData) : JSON.parse(localStorage.data);
    let editObj = JSON.parse(storage[Todo.indexToEdit]);
    editObj.title = document.getElementById("input").value;
    editObj.description = document.getElementById("description").value;
    editObj.date = GetCurrentDateTime();
    storage[Todo.indexToEdit] = JSON.stringify(editObj);
    if (Todo.editItemIsArchived) {
        localStorage.archivedData = JSON.stringify(storage);
        HideArchive();
        ShowArchive();
    }
    else {
        localStorage.data = JSON.stringify(storage);
        ShowList();
    }
    document.getElementById("editBtn").setAttribute("hidden", "");
    document.getElementById("addBtn").removeAttribute("hidden");
    document.getElementById("input").value = "";
    document.getElementById("description").value = "";
    Todo.editItemIsArchived = false;
}

// to search in localStorage and display results accordingly
function SearchStorage() {
    let input = document.getElementById("searchInp").value;
    let storage = [];
    if (localStorage.data) {
        storage = JSON.parse(localStorage.data);
    }
    let searchedList = [];

    for (let item of storage) {
        let obj = JSON.parse(item);
        let title = "";
        title = obj.title;
        if (title.toLowerCase().includes(input.toLowerCase())) {
            searchedList.push(obj);
        }
    }
    if (searchedList.length !== 0) {
        document.getElementById("myUL").innerHTML = "";
        for (let item of searchedList) {
            Add_li(item.id, item.title, item.description, item.date);
        }
        document.getElementById("searchBtn").hidden = true;
        document.getElementById("cancelBtn").hidden = false;
    }
    else {
        alert("No matching data in TODO");
        return false;
    }
}

// to handle cancel search button
function CancelSearch() {
    document.getElementById("myUL").innerHTML = "";
    ShowList();
    document.getElementById("searchBtn").hidden = false;
    document.getElementById("searchInp").value = "";
    document.getElementById("cancelBtn").hidden = true;
}

//handle BackUpList
function BackUpList() {
    if (localStorage.deletedData != "") {
        let deletedData = JSON.parse(localStorage.deletedData);
        let storage = JSON.parse(localStorage.data);

        for (let item of deletedData) {
            storage.push(item);
        }
        localStorage.data = JSON.stringify(storage);
        localStorage.deletedData = "";
        ShowList();
    }
    else {
        alert("No data for backup");
        return false;
    }
}

//handle DeleteList
function DeleteList() {
    let checkedelements = GetCheckedElements();
    if (checkedelements) {
        for (const element of checkedelements)
            DeleteTodo(element.id.replace('cb', 'dl'));
    }
    else {
        alert("None of the Notes selected!");
    }
}

// handle Archive
function ArchiveList() {
    let checkedelements = GetCheckedElements();
    if (checkedelements) {
        let storage;
        storage = JSON.parse(localStorage.data);
        let indexToRemove = undefined;
        let archivedData = [];
        for (const element of checkedelements) {
            if (localStorage.archivedData) {
                archivedData = JSON.parse(localStorage.archivedData);
            }
            for (let i = 0; i < storage.length; i++) {
                let obj = JSON.parse(storage[i]);
                if (obj.id == element.id.replace('cb', '')) {
                    indexToRemove = i;
                    archivedData.push(storage[i]);
                    break;
                }
            }
            storage.splice(indexToRemove, 1);
            localStorage.archivedData = JSON.stringify(archivedData);
            localStorage.data = JSON.stringify(storage);
            ShowList();
        }
    }
    else {
        alert("None of the Notes selected!");
    }
}

// handle ShowArchive
function ShowArchive() {
    if (localStorage.archivedData) {
        let archivedData = JSON.parse(localStorage.archivedData);
        let li = document.createElement("li");
        let title = document.createTextNode("ARCHIVED LIST");
        li.appendChild(title);
        li.className = "archived";
        li.style.textAlign = "center";
        document.getElementById("archivedUL").appendChild(li);
        for (let data of archivedData) {
            let obj = JSON.parse(data);
            Add_li(obj.id, obj.title, obj.description, obj.date, true);
        }
        document.getElementById("show").hidden = true;
        document.getElementById("hide").hidden = false;

    }
    else {
        alert("No archived data!");
    }
}

function HideArchive() {
    document.getElementById("archivedUL").innerHTML = '';
    document.getElementById("hide").hidden = true;
    document.getElementById("show").hidden = false;
}

//Get Checked Elements
function GetCheckedElements() {
    let checkboxes = document.getElementsByClassName("select");
    let checkedelements = [];
    for (const element of checkboxes) {
        if (element.checked)
            checkedelements.push(element);
    }
    return checkedelements.length !== 0 ? checkedelements : false;
}

