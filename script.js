const addBtn = document.getElementById("addEvent");
const container = document.getElementById("eventsContainer");
addBtn.addEventListener("click", function(){

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;

    const card = document.createElement("div");
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${date}</p>
    `;

    container.appendChild(card);
});