// === Navigation: Farbe ändern beim Scrollen ===
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) { 
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
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
if (themeButton) {
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeButton.textContent = "Helles Design";
    } else {
      themeButton.textContent = "Dunkles Design";
    }
  });
}

// === Projekt "Fakten-Generator" ===
const factButton = document.querySelector("#fetch-fact-btn");
const factTextElement = document.querySelector("#fact-text");
if (factButton) {
  factButton.addEventListener("click", () => {
    holeEinenFakt();
  });
}
async function holeEinenFakt() {
  if (!factTextElement) return;
  factTextElement.textContent = "Lade Fakt...";
  try {
    const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=de");
    const data = await response.json();
    factTextElement.textContent = data.text;
  } catch (error) {
    factTextElement.textContent = "Ups! Konnte den Fakt nicht laden. Versuch's nochmal.";
    console.error("Fehler beim Laden des Fakts:", error);
  }
}

// === Projekt "To-Do-Liste" (CRUD) ===
const todoInput = document.querySelector("#todo-input");
const addTodoButton = document.querySelector("#add-todo-btn");
const todoList = document.querySelector("#todo-list");
if (addTodoButton) {
  addTodoButton.addEventListener("click", () => {
    erstelleNeueAufgabe();
  });
  todoInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      erstelleNeueAufgabe();
    }
  });
}
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
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
    speichereDieListe();
  });
  deleteButton.addEventListener("click", () => {
    todoList.removeChild(li);
    speichereDieListe();
  });
  li.appendChild(span);
  li.appendChild(deleteButton);
  todoList.prepend(li);
  speichereDieListe();
  todoInput.value = "";
}
function speichereDieListe() {
  const alleAufgaben = document.querySelectorAll(".todo-item");
  const todoListeAlsArray = [];
  alleAufgaben.forEach((li) => {
    const text = li.querySelector("span").textContent;
    const erledigt = li.classList.contains("completed");
    todoListeAlsArray.push({ text: text, erledigt: erledigt });
  });
  localStorage.setItem("meineTodos", JSON.stringify(todoListeAlsArray.reverse()));
}
function ladeDieListe() {
  const gespeicherteTodos = localStorage.getItem("meineTodos");
  if (gespeicherteTodos === null) return;
  const todoListeAlsArray = JSON.parse(gespeicherteTodos);
  todoListeAlsArray.forEach((aufgabe) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    const span = document.createElement("span");
    span.textContent = aufgabe.text;
    if (aufgabe.erledigt) li.classList.add("completed");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-btn");
    span.addEventListener("click", () => {
      li.classList.toggle("completed");
      speichereDieListe();
    });
    deleteButton.addEventListener("click", () => {
      todoList.removeChild(li);
      speichereDieListe();
    });
    li.appendChild(span);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}
if(todoList) {
  ladeDieListe();
}

// === Projekt: Smartes Kontaktformular ===
const contactForm = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const submitButton = document.querySelector("#submit-btn");
function zeigeFehler(inputElement, nachricht) {
  const formGroup = inputElement.parentElement;
  formGroup.classList.add("error");
  const errorText = formGroup.querySelector(".error-message");
  errorText.textContent = nachricht;
}
function zeigeErfolg(inputElement) {
  const formGroup = inputElement.parentElement;
  formGroup.classList.remove("error");
  const errorText = formGroup.querySelector(".error-message");
  errorText.textContent = "";
}
function pruefeEmail(emailElement) {
  const email = emailElement.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    zeigeFehler(emailElement, "E-Mail darf nicht leer sein.");
    return false;
  } else if (!emailRegex.test(email)) {
    zeigeFehler(emailElement, "Das ist keine gültige E-Mail-Adresse.");
    return false;
  } else {
    zeigeErfolg(emailElement);
    return true;
  }
}
function pruefeObLeer(inputElement, feldName) {
  if (inputElement.value === "") {
    zeigeFehler(inputElement, `${feldName} darf nicht leer sein.`);
    return false;
  } else {
    zeigeErfolg(inputElement);
    return true;
  }
}
function validiereFormular() {
  const istNameGueltig = pruefeObLeer(nameInput, "Name");
  const istEmailGueltig = pruefeEmail(emailInput);
  const istNachrichtGueltig = pruefeObLeer(messageInput, "Nachricht");
  if (istNameGueltig && istEmailGueltig && istNachrichtGueltig) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}
if (contactForm) {
  contactForm.addEventListener("keyup", () => { validiereFormular(); });
  nameInput.addEventListener("blur", () => validiereFormular());
  emailInput.addEventListener("blur", () => validiereFormular());
  messageInput.addEventListener("blur", () => validiereFormular());
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Formular-Validierung erfolgreich! (Hier würde der Versand stattfinden)");
    submitButton.disabled = true;
    contactForm.reset();
    zeigeErfolg(nameInput);
    zeigeErfolg(emailInput);
    zeigeErfolg(messageInput);
  });
}

/* === PROJEKT: "Emi Runner" Spiel (PHASE 5 - REPARIERT) === */
const player = document.querySelector("#player");
const obstacle = document.querySelector("#obstacle");
const gameOverScreen = document.querySelector("#game-over-screen");
const scoreDisplay = document.querySelector("#score");
const gameWorld = document.querySelector("#game-world");
const ground = document.querySelector("#ground");

let isJumping = false;
let isDucking = false;
let isGameOver = false;
let score = 0;
let obstacleSpeed = 4;
let gameLoop;
let scoreLoop;
let jumpCount = 0;
let playerAnimations = [];

function clearPlayerAnimations() {
  playerAnimations.forEach(clearTimeout);
  playerAnimations = [];
  player.classList.remove("is-jumping", "is-double-jumping", "is-ducking");
  
  // ZURÜCK ZUR LAUF-TAPETE!
  player.style.backgroundImage = `url('sheet_run_slide.png')`; 
  player.style.backgroundSize = '280px 210px';
  player.style.height = '70px'; // Standard-Höhe
  
  isJumping = false;
  isDucking = false;
  jumpCount = 0;
}

function jump() {
  if (isGameOver || isDucking) return; 
  player.classList.remove("is-running");

  if (!isJumping) { // Nur wenn er nicht schon springt
    clearPlayerAnimations();
    // WAFFENWECHSEL ZUM SPRUNG-BLATT
    player.style.backgroundImage = `url('sheet_jump.png')`;
    player.style.backgroundSize = '280px 140px'; 
  }

  if (jumpCount === 0) {
    isJumping = true; 
    jumpCount = 1;
    player.classList.add("is-jumping");
    
    let jumpTimeout = setTimeout(() => {
      isJumping = false;
      player.classList.remove("is-jumping");
      player.style.backgroundImage = `url('sheet_run_slide.png')`; 
      player.style.backgroundSize = '280px 210px'; 
      jumpCount = 0; 
      if (!isGameOver && !isDucking) player.classList.add("is-running");
    }, 500);
    playerAnimations.push(jumpTimeout);
  } 
  else if (jumpCount === 1) { 
    jumpCount = 2; 
    player.classList.remove("is-jumping"); 
    void player.offsetWidth; 
    player.classList.add("is-double-jumping");
    
    let doubleJumpTimeout = setTimeout(() => {
      isJumping = false;
      player.classList.remove("is-double-jumping");
      player.style.backgroundImage = `url('sheet_run_slide.png')`; 
      player.style.backgroundSize = '280px 210px'; 
      jumpCount = 0; 
      if (!isGameOver && !isDucking) player.classList.add("is-running");
    }, 700);
    playerAnimations.push(doubleJumpTimeout);
  }
}

function duck() {
  if (isJumping && !isGameOver) {
      clearPlayerAnimations(); 
  }
  if (isGameOver || isDucking) return; 

  player.classList.remove("is-running");
  isDucking = true;
  player.classList.add("is-ducking");
  
  // HIER WAR DER FEHLER: Wir müssen dem Ducken auch die richtige Tapete geben!
  player.style.backgroundImage = `url('sheet_run_slide.png')`;
  player.style.backgroundSize = '280px 210px'; 
  
  let duckTimeout = setTimeout(() => {
    isDucking = false;
    player.classList.remove("is-ducking");
    if (!isGameOver && !isJumping) player.classList.add("is-running");
  }, 500);
  playerAnimations.push(duckTimeout);
}

function spawnObstacle() {
  obstacle.style.left = "100%"; 
  let rand = Math.random(); 
  if (rand < 0.4) {
    obstacle.src = 'obstacle_low.png';
    obstacle.classList.remove('obstacle-high');
    obstacle.classList.remove('obstacle-momo');
  } else if (rand < 0.7) {
    obstacle.src = 'obstacle_high.png';
    obstacle.classList.add('obstacle-high');
    obstacle.classList.remove('obstacle-momo');
  } else {
    obstacle.src = 'obstacle_momo.png';
    obstacle.classList.remove('obstacle-high');
    obstacle.classList.add('obstacle-momo');
  }
  obstacleSpeed += 0.05;
}

function triggerGameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  clearInterval(scoreLoop);
  gameWorld.style.animationPlayState = "paused";
  ground.style.animationPlayState = "paused";
  clearPlayerAnimations(); 
  gameOverScreen.style.display = "block";
  gameOverScreen.textContent = `GAME OVER (Score: ${score}). Leertaste drücken!`;
}

function gameLoopLogic() {
  if (isGameOver) return;
  let obstacleLeftCurrent = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
  obstacleLeftCurrent -= obstacleSpeed;
  obstacle.style.left = obstacleLeftCurrent + "px";
  if (obstacleLeftCurrent < -60) {
    spawnObstacle();
  }

  const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
  const playerHeight = parseInt(window.getComputedStyle(player).getPropertyValue("height"));
  const isHighObstacle = obstacle.classList.contains('obstacle-high');
  const isMomoObstacle = obstacle.classList.contains('obstacle-momo');
  
  if (obstacleLeftCurrent < 75 && obstacleLeftCurrent > 40) { 
    if (isHighObstacle && playerHeight > 60) { 
      triggerGameOver();
    }
    if (!isHighObstacle && !isMomoObstacle && playerBottom < 50) {
      triggerGameOver();
    }
    if (isMomoObstacle && playerBottom < 90) {
      triggerGameOver();
    }
  }
} 

function startScore() {
  score = 0;
  clearInterval(scoreLoop);
  scoreLoop = setInterval(() => {
    if (!isGameOver) {
      score++;
      scoreDisplay.textContent = score;
    }
  }, 100);
}

function startGame() {
  isGameOver = false;
  obstacleSpeed = 4;
  scoreDisplay.textContent = 0;
  gameOverScreen.style.display = "none";
  
  clearPlayerAnimations(); 

  player.classList.add("is-running"); 
  spawnObstacle(); 
  gameWorld.style.animationPlayState = "running";
  ground.style.animationPlayState = "running";

  clearInterval(gameLoop);
  clearInterval(scoreLoop);
  gameLoop = setInterval(gameLoopLogic, 10);
  startScore();
}

if (gameWorld) { 
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault(); 
      if (isGameOver) {
        startGame(); 
      } else {
        jump(); 
      }
    }
    if (event.code === "ArrowDown") {
      event.preventDefault(); 
      if (!isGameOver) {
        duck(); 
      }
    }
  });
  startGame();
}