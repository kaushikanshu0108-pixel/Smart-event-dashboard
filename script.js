
const addBtn = document.getElementById("addEvent");
const container = document.getElementById("eventsContainer");

addBtn.addEventListener("click", function(){

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    if(title === "" || date === ""){
        alert("Please fill required fields!");
        return;
    }

    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
    <div class="card-header">
        <h3 class="event-title">${title}</h3>
        <button class="delete-btn">X</button>
    </div>

    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Category:</strong> ${category}</p>

    <button class="complete-btn">Mark Complete</button>
    `;

    container.appendChild(card);

    // Clear form
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("description").value = "";
});


// ✅ Event Delegation
container.addEventListener("click", function(e){

    if(e.target.classList.contains("delete-btn")){
        e.target.parentElement.remove();
    }

    if(e.target.classList.contains("complete-btn")){
        e.target.parentElement.classList.toggle("completed");
    }

});