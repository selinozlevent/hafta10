const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");
const colorButtons = document.querySelectorAll(".color");
const searchInput = document.getElementById("search");

let selectedColor = "yellow";
let notes = [];

colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedColor = btn.dataset.color;
  });
});

addNoteBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (text) {
    notes.push({ text, color: selectedColor });
    noteInput.value = "";
    renderNotes();
  }
});

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value.toLowerCase());
});

function renderNotes(filter = "") {
  notesContainer.innerHTML = "";
  notes
    .filter((note) => note.text.toLowerCase().includes(filter))
    .forEach((note) => {
      const div = document.createElement("div");
      div.className = "note";
      div.style.background = note.color;
      div.textContent = note.text;
      notesContainer.appendChild(div);
    });
}
