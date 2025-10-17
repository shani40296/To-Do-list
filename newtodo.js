window.addEventListener("load", loadTasks);

document.getElementById("inp-btn").addEventListener("click", function () {
    const taskText = document.getElementById("inp-text").value.trim();
    const taskTime = document.getElementById("inp-time").value;

    if (!taskText || !taskTime) {
        alert("Please enter both Task and Time!");
        return;
    }

    createTask(taskText, taskTime);

    document.getElementById("inp-text").value = "";
    document.getElementById("inp-time").value = "";

    updateStorage();
});

// Create a task
function createTask(taskText, taskTime, isChecked=false) {
    const newtask = document.createElement("p");

    // Checkbox + Task + Button Group
    newtask.innerHTML = `
        <input type="checkbox" class="checkbox-btn" ${isChecked ? "checked" : ""}>
        <span style="text-decoration:${isChecked ? "line-through" : "none"}">${taskText} ⏰ ${taskTime}</span>
        <div class="btn-group">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    document.querySelector(".mp1").prepend(newtask);

    // Events
    const checkbox = newtask.querySelector(".checkbox-btn");
    const span = newtask.querySelector("span");
    checkbox.addEventListener("change", function () {
        span.style.textDecoration = this.checked ? "line-through" : "none";
        span.style.color = this.checked ? "gray" : "black";
        updateStorage();
    });

    const editBtn = newtask.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
        const newText = prompt("Edit your task:", taskText);
        if(newText !== null && newText.trim() !== ""){
            span.textContent = `${newText} ⏰ ${taskTime}`;
            updateStorage();
        }
    });

    const deleteBtn = newtask.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
        if(confirm("Do you want to delete this task?")){
            newtask.remove();
            updateStorage();
        }
    });

    // Alarm
    const [hours, minutes] = taskTime.split(":");
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);
    const timeDiff = alarmTime.getTime() - new Date().getTime();
    if(timeDiff>0){
        setTimeout(()=>{
            alert(`⏰ Time for: ${taskText}!`);
            new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg").play();
        }, timeDiff);
    }
}

// Local Storage
function updateStorage(){
    const tasks = [];
    document.querySelectorAll(".mp1 p").forEach(p => {
        const span = p.querySelector("span");
        const [text, time] = span.textContent.split(" ⏰ ");
        const checked = p.querySelector(".checkbox-btn").checked;
        tasks.push({text, time, checked});
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        createTask(task.text, task.time, task.checked);
    });
}

