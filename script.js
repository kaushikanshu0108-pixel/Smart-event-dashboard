const addBtn = document.getElementById("addEvent");
const eventsContainer = document.getElementById("eventsContainer");

addBtn.addEventListener("click", () => {

    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    if(title === "" || date === ""){
        alert("Please enter event title and date");
        return;
    }

    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
        <div class="card-header">
            <h3 class="event-title">${title}</h3>
            <button class="delete-btn">X</button>
        </div>

        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p>${description}</p>

        <button class="complete-btn">Mark Complete</button>
    `;

    eventsContainer.appendChild(card);

    // Clear form
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("description").value = "";
});

/* Event Delegation */
eventsContainer.addEventListener("click", (e) => {

    if(e.target.classList.contains("delete-btn")){
        e.target.closest(".event-card").remove();
    }

    if(e.target.classList.contains("complete-btn")){
        e.target.closest(".event-card").classList.toggle("completed");
    }
});