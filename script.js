// Smart Event Dashboard
// Vanilla JS — state, persistence, filtering, search, and rendering.

const STORAGE_KEY = "smart-event-dashboard:events";

const els = {
  form: document.getElementById("event-form"),
  title: document.getElementById("title"),
  date: document.getElementById("date"),
  category: document.getElementById("category"),
  description: document.getElementById("description"),
  list: document.getElementById("event-list"),
  empty: document.getElementById("empty-state"),
  emptyTitle: document.getElementById("empty-title"),
  emptySub: document.getElementById("empty-sub"),
  countLine: document.getElementById("count-line"),
  search: document.getElementById("search"),
  tabs: document.querySelectorAll(".tab"),
  template: document.getElementById("ticket-template"),
};

let events = loadEvents();
let activeFilter = "all";
let searchTerm = "";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WEEKDAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read saved events:", err);
    return [];
  }
}

function saveEvents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error("Could not save events:", err);
  }
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addEvent(data) {
  events.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title: data.title.trim(),
    date: data.date,
    category: data.category,
    description: data.description.trim(),
    completed: false,
    createdAt: Date.now(),
  });
  saveEvents();
  render();
}

function toggleComplete(id) {
  const ev = events.find((e) => e.id === id);
  if (ev) ev.completed = !ev.completed;
  saveEvents();
  render();
}

function deleteEvent(id) {
  const card = els.list.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add("removing");
    card.addEventListener("animationend", () => {
      events = events.filter((e) => e.id !== id);
      saveEvents();
      render();
    }, { once: true });
  } else {
    events = events.filter((e) => e.id !== id);
    saveEvents();
    render();
  }
}

function getFilteredSorted() {
  const today = todayISO();
  let list = events.slice();

  if (activeFilter === "upcoming") {
    list = list.filter((e) => !e.completed && parseDate(e.date) >= today);
  } else if (activeFilter === "past") {
    list = list.filter((e) => !e.completed && parseDate(e.date) < today);
  } else if (activeFilter === "completed") {
    list = list.filter((e) => e.completed);
  }

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  return list;
}

function render() {
  const today = todayISO();
  const list = getFilteredSorted();

  els.list.innerHTML = "";

  if (events.length === 0) {
    els.empty.hidden = false;
    els.emptyTitle.textContent = "No events yet";
    els.emptySub.textContent = "Add your first event above — it'll show up here as a ticket.";
  } else if (list.length === 0) {
    els.empty.hidden = false;
    els.emptyTitle.textContent = "No matching events";
    els.emptySub.textContent = "Try a different filter or search term.";
  } else {
    els.empty.hidden = true;
  }

  const frag = document.createDocumentFragment();

  list.forEach((ev) => {
    const node = els.template.content.cloneNode(true);
    const ticket = node.querySelector(".ticket");
    const d = parseDate(ev.date);

    ticket.dataset.id = ev.id;
    ticket.dataset.category = ev.category;
    if (ev.completed) ticket.classList.add("completed");
    if (!ev.completed && d < today) ticket.classList.add("past");

    node.querySelector(".category-chip").textContent = ev.category;
    node.querySelector(".ticket-title").textContent = ev.title;

    const noteEl = node.querySelector(".ticket-note");
    noteEl.textContent = ev.description || "No additional details.";

    node.querySelector(".stub-month").textContent = MONTHS[d.getMonth()];
    node.querySelector(".stub-day").textContent = String(d.getDate()).padStart(2, "0");
    node.querySelector(".stub-weekday").textContent = WEEKDAYS[d.getDay()];

    const completeBtn = node.querySelector(".complete-btn");
    completeBtn.textContent = ev.completed ? "Undo" : "Mark complete";

    frag.appendChild(node);
  });

  els.list.appendChild(frag);

  const total = events.length;
  const shown = list.length;
  els.countLine.textContent =
    total === 0
      ? ""
      : `Showing ${shown} of ${total} event${total === 1 ? "" : "s"}`;
}

// ---------- Event delegation for ticket actions ----------
els.list.addEventListener("click", (e) => {
  const ticket = e.target.closest(".ticket");
  if (!ticket) return;
  const id = ticket.dataset.id;

  if (e.target.closest(".complete-btn")) {
    toggleComplete(id);
  } else if (e.target.closest(".delete-btn")) {
    deleteEvent(id);
  }
});

// ---------- Form submit ----------
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!els.title.value.trim() || !els.date.value) return;

  addEvent({
    title: els.title.value,
    date: els.date.value,
    category: els.category.value,
    description: els.description.value,
  });

  els.form.reset();
  els.title.focus();
});

// ---------- Filter tabs ----------
els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    els.tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    activeFilter = tab.dataset.filter;
    render();
  });
});

// ---------- Search ----------
els.search.addEventListener("input", () => {
  searchTerm = els.search.value;
  render();
});

// ---------- Init ----------
render();