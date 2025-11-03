// === Navigation: Farbe ändern beim Scrollen ===
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// === Zurück nach oben Button ===
const toTopBtn = document.createElement("button");
toTopBtn.textContent = "↑";
toTopBtn.id = "toTopBtn";
document.body.appendChild(toTopBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTopBtn.classList.add("show");
  } else {
    toTopBtn.classList.remove("show");
  }
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// === Dark Mode Umschalter ===
const themeButton = document.querySelector("#theme-toggle");

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Helles Design";
  } else {
    themeButton.textContent = "Dunkles Design";
  }
});


// === Projekt "Fakten-Generator" ===
const factButton = document.querySelector("#fetch-fact-btn");
const factTextElement = document.querySelector("#fact-text");

factButton.addEventListener("click", () => {
  holeEinenFakt();
});

async function holeEinenFakt() {
  factTextElement.textContent = "Lade Fakt...";
  try {
    const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=de");
    const data = await response.json();
    const fact = data.text;
    factTextElement.textContent = fact;
  } catch (error) {
    factTextElement.textContent = "Ups! Konnte den Fakt nicht laden. Versuch's nochmal.";
    console.error("Fehler beim Laden des Fakts:", error);
  }
}


// === Projekt "To-Do-Liste" (CRUD) ===
const todoInput = document.querySelector("#todo-input");
const addTodoButton = document.querySelector("#add-todo-btn");
const todoList = document.querySelector("#todo-list");

addTodoButton.addEventListener("click", () => {
  erstelleNeueAufgabe();
});

todoInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    erstelleNeueAufgabe();
  }
});


function erstelleNeueAufgabe() {
  const aufgabenText = todoInput.value;
  if (aufgabenText === "") {
    alert("Du musst schon was eintippen!");
    return;
  }

  const li = document.createElement("li");
  li.classList.add("todo-item");

  const span = document.createElement("span");
  span.textContent = aufgabenText;
  
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete-btn");

  // (UPDATE) Klick-Listener mit Speicher-Befehl
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
    speichereDieListe(); // KORRIGIERT
  });

  // (DELETE) Klick-Listener mit Speicher-Befehl
  deleteButton.addEventListener("click", () => {
    todoList.removeChild(li);
    speichereDieListe(); // KORRIGIERT
  });

  // Zusammenbau
  li.appendChild(span);
  li.appendChild(deleteButton);
  
  todoList.prepend(li);
  
  speichereDieListe(); // KORRIGIERT
  
  todoInput.value = "";
}


// === BONUS-LEVEL: SPEICHERN & LADEN ===

function speichereDieListe() {
  const alleAufgaben = document.querySelectorAll(".todo-item");
  const todoListeAlsArray = [];

  // KORRIGIERTE "forEach"-Schleife
  alleAufgaben.forEach((li) => {
    const text = li.querySelector("span").textContent;
    const erledigt = li.classList.contains("completed");
    
    todoListeAlsArray.push({
      text: text,
      erledigt: erledigt
    });
  });

  localStorage.setItem("meineTodos", JSON.stringify(todoListeAlsArray.reverse()));
}


function ladeDieListe() {
  const gespeicherteTodos = localStorage.getItem("meineTodos");

  if (gespeicherteTodos === null) {
    return;
  }

  const todoListeAlsArray = JSON.parse(gespeicherteTodos);

  // KORRIGIERTE "forEach"-Schleife (Klammer-Position)
  todoListeAlsArray.forEach((aufgabe) => {
    
    const li = document.createElement("li");
    li.classList.add("todo-item");

    const span = document.createElement("span");
    span.textContent = aufgabe.text;
    
    if (aufgabe.erledigt) {
      li.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-btn");

    // (UPDATE) Klick-Listener mit Speicher-Befehl
    span.addEventListener("click", () => {
      li.classList.toggle("completed");
      speichereDieListe(); // KORRIGIERT
    });

    // (DELETE) Klick-Listener mit Speicher-Befehl
    deleteButton.addEventListener("click", () => {
      todoList.removeChild(li);
      speichereDieListe(); // KORRIGIERT
    });

    // Zusammenbau (innerhalb der Schleife)
    li.appendChild(span);
    li.appendChild(deleteButton);
    todoList.appendChild(li);

  }); // <-- KORRIGIERTE Klammer-Position
}

// Lade-Funktion EINMAL beim Start aufrufen
ladeDieListe();

// DAS IST DAS ENDE.