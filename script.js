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
card.innerHTML = `
    <h3>${title}</h3>
    <p>${date}</p>
    <button class="delete">Delete</button>
`;
card.querySelector(".delete").addEventListener("click", function(){
    card.remove();
});
container.addEventListener("click", function(e){

    if(e.target.classList.contains("delete")){
        e.target.parentElement.remove();
    }

});
<button class="complete">Complete</button>
if(e.target.classList.contains("complete")){
    e.target.parentElement.style.textDecoration = "line-through";
}