var heading = document.querySelector("h1");
console.log("my heading:", heading);

var editForm = document.querySelector("#edit-task");
editForm.style.display = "none";

var newForm = document.querySelector("#new-task");
newForm.style.display = "block";



var editTaskId = null;

var button = document.querySelector("#submit");
console.log("my button:", button);

button.onclick = function(){
    var taskInput = document.querySelector("#taskInput");
    var priorityInput = document.querySelector("#priorityInput");
    var assignmentInput = document.querySelector("#assignmentInput");
    var estimateInput = document.querySelector("#estimateInput");

    createNewTask(taskInput.value, priorityInput.value, assignmentInput.value, estimateInput.value);
};

function deletePieFromServer(taskID) {
    fetch("http://localhost:1234/todo/" + taskID, {
        method: "DELETE",
    }).then(function (response) {
        console.log("delete worked! now reload list.");
        loadToDoList();
    });
}

function showEditForm(task, priority, assignment, estimate, editTaskId) {
    var tas = document.getElementById("taskChange");
    tas.value = task;

    var prior = document.getElementById("priorityChange");
    prior.value = priority;

    var assign = document.getElementById("assignmentChange");
    assign.value = assignment;

    var est = document.getElementById("estimateChange");
    est.value = estimate;

    var editSubmitButton = document.querySelector("#editSubmitButton")
    editSubmitButton.onclick = function (){
        editTask(tas.value, prior.value, assign.value, est.value, editTaskId);
        editForm.style.display = "none";
        newForm.style.display = "block";
        
    }

    
    /*var editDiv = document.querySelector("#updateDiv");

    var task = document.createElement("input");
    task.setAttribute("value", task);
    editDiv.appendChild(task);

    change:::
        car tas = document.getElementById("taskChange");
        tas.value = task;





    var priority = document.createElement("input");
    priority.setAttribute("value", priority);
    editDiv.appendChild(priority);

    var assignment = document.createElement("input");
    assignment.setAttribute("value", assignment);
    editDiv.appendChild(assignment);

    var estimate = document.createElement("input");
    estimate.setAttribute("value", estimate);
    editDiv.appendChild(estimate);

    var editSubmitButton = document.createElement("button");
    editSubmitButton.innerHTML = "change";
    editSubmitButton.classList.add("editSubmitButton");
    editDiv.appendChild(editSubmitButton); 



    var editSubmitButton = document.querySelector("#editSubmitButton")
    editSubmitButton.onclick = function (){
        editTask(task.value, priority.value, assignment.value, estimate.value);
        
    }  */

    

}

function editTask(task, priority, assignment, estimate, editTaskId) {
    var data = "task=" + encodeURIComponent(task);
    data += "&priority=" + encodeURIComponent(priority);
    data += "&assignment=" + encodeURIComponent(assignment);
    data += "&estimate=" + encodeURIComponent(estimate);

    fetch("http://localhost:1234/todo/" + editTaskId, {
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        console.log("did this update?????");
        loadToDoList();
    });

}

function createNewTask(task, priority, assignment, estimate) {
    var data = "task=" + encodeURIComponent(task);
    data += "&priority=" + encodeURIComponent(priority);
    data += "&assignment=" + encodeURIComponent(assignment);
    data += "&estimate=" + encodeURIComponent(estimate);
    fetch("http://localhost:1234/todo", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response) {
        console.log("did this complete?????");
        /* fill with empty strings*/
        var tas = document.getElementById("taskInput");
        tas.value = "";

        var prior = document.getElementById("priorityInput");
        prior.value = "";

        var assign = document.getElementById("assignmentInput");
        assign.value = "";

        var est = document.getElementById("estimateInput");
        est.value = "";

        loadToDoList();
    });
}

function loadToDoList () {
    fetch("http://localhost:1234/todo").then(function(response){
        
        response.json().then(function(data) {
            TODO = data;
            console.log("todo list loaded from the server", TODO)
            var toDoList = document.querySelector("#tasksList");
            toDoList.innerHTML = "";
            data.forEach(function(task){
                var newTask = document.createElement("li");
                //newTask.innerHTML = task;
                //toDoList.appendChild(newTask);
                var taskDiv = document.createElement("div");
                taskDiv.innerHTML = task.task;
                taskDiv.classList.add("tasksStyle");
                newTask.appendChild(taskDiv);
                
                var assignDiv = document.createElement("div");
                assignDiv.innerHTML = task.assignment;
                assignDiv.classList.add("assignmentStyle");
                newTask.appendChild(assignDiv);

                var priorityDiv = document.createElement("div");
                priorityDiv.innerHTML = task.priority;
                priorityDiv.classList.add("priorityStyle");
                newTask.appendChild(priorityDiv);

                var deleteButton = document.createElement("button");
                deleteButton.classList.add("deleteButton");
                deleteButton.innerHTML = "delete";

                deleteButton.onclick = function (){
                    console.log("delete me!", task.id);
                    var result = window.confirm("Are you sure you want to delete this task??");
                    if (result == true) {
                        deletePieFromServer(task.id);
                    }else {

                    }
                    // deletePieFromServer(task.id);
                };


                newTask.appendChild(deleteButton);
                //newTask.style.backgroundColor("#0f0f0f");
                //edit



                var editButton = document.createElement("button");
                editButton.classList.add("editButton");
                editButton.innerHTML = "edit";
                
                editTaskId = task.id;

                editButton.onclick = function (){
                    if (editForm.style.display == "none") {
                        editForm.style.display = "block";
                        showEditForm(task.task, task.priority, task.assignment, task.estimate, task.id);
                        newForm.style.display = "none";
                        
                    }
                    else{
                        newForm.style.display = "block";
                        editForm.style.display = "none";
                    }

                    
                    
                    
                };
                newTask.classList.add("NEWtask");
                newTask.appendChild(editButton);


                toDoList.appendChild(newTask);

            });
        });
    });
}

loadToDoList();
