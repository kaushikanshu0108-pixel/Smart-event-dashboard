function addEvent(){

    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value;

    if(title === "" || date === ""){
        alert("Please fill required fields!");
        return;
    }

    let eventList = document.getElementById("eventList");

    let card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
        <button class="delete-btn" onclick="deleteEvent(this)">X Delete</button>

        <div class="event-title">${title}</div>

        <p><b>Date:</b> ${date}</p>
        <p><b>Category:</b> ${category}</p>
        <p>${description}</p>

        <button class="complete-btn" onclick="markComplete(this)">
            Mark Complete
        </button>
    `;

    eventList.appendChild(card);

    // Clear form
    document.getElementById("title").value="";
    document.getElementById("date").value="";
    document.getElementById("description").value="";
}

function deleteEvent(button){
    button.parentElement.remove();
}

function markComplete(button){
    button.parentElement.classList.toggle("complete");
}