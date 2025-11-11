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
// (Alle To-Do-Funktionen bleiben gleich)
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
// (Alle Formular-Funktionen bleiben gleich)
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


/* === PROJEKT: "Emi Runner" (VERSION 7.4: FINAL PRELOADER) === */
const gameWorld = document.querySelector("#game-world");

if (gameWorld) {
  // DOM
  const player = document.getElementById("player");
  const gameOverScreen = document.getElementById("game-over-screen");
  const scoreDisplay = document.getElementById("score");
  const playerHitbox = document.getElementById("player-hitbox");
  const zombieObstacle = document.getElementById("obstacle");
  const zombieHitbox = document.getElementById("obstacle-hitbox");
  const rocketObstacle = document.getElementById("rocket-obstacle");
  const rocketHitbox = document.getElementById("rocket-hitbox");
  
  // --- SPIELER-KONSTANTEN ---
  const SPRITE_RUN = "Running.png";
  const SPRITE_ROLL = "Roll.png";
  const SPRITE_JUMP = "Jumping.png";
  const SPRITE_FALL = "Falling.png";
  const SPRITE_LAND = "landing.png"; 
  const SPRITE_DJUMP = "Double_Jump.png";
  const SPRITE_DEAD = "Dead.png"; 

  const FRAME_W = 140; 
  const FRAME_H = 140;
  
  const COLS_RUN = 12;
  const COLS_ROLL = 9;
  const COLS_JUMP = 10;
  const COLS_FALL = 11;
  const COLS_LAND = 6;
  const COLS_DJUMP = 11;
  const COLS_DEAD = 5;

  // --- HINDERNIS-KONSTANTEN ---
  const ZOMBIE_PATHS = [
    "Zombie_1/Walk.png",
    "Zombie_2/Walk.png",
    "Zombie_3/Walk.png",
    "Zombie_4/Walk.png"
  ];
  const ZOMBIE_FPS = 10;
  const ZOMBIE_TYPE_LOW = "low";
  const ZOMBIE_TYPE_HIGH = "high";
  
  // --- DAS FEHLENDE ARRAY (FIX) ---
  const ALL_SPRITES = [
    SPRITE_RUN,
    SPRITE_ROLL,
    SPRITE_JUMP,
    SPRITE_FALL,
    SPRITE_LAND,
    SPRITE_DJUMP,
    SPRITE_DEAD,
    ...ZOMBIE_PATHS, // Fügt Zombies 1-4 hinzu
    "Obstacle_LippenstiftRakete.png" // Fügt die Rakete hinzu
  ];
  
  // --- GESCHWINDIGKEIT ---
  const BASE_OBSTACLE_SPEED = 2.5;
  const MIN_OBSTACLE_SPEED = 1.5;
  const SPEED_INCREASE_INTERVAL = 100;
  const SPEED_INCREASE_AMOUNT = 0.05;
  
  let obstacleSpeed = BASE_OBSTACLE_SPEED;

  // --- PHYSIK ---
  const GRAVITY = 1500;
  const JUMP_VELOCITY = 750;
  const DJUMP_VELOCITY = 650;
  const MAX_FALL_SPEED = 1400;
  const FLOOR_Y = 0;
  const OFFSET_Y = 1;
  const COYOTE_TIME = 0.12;
  const JUMP_BUFFER = 0.12;
  const VARIABLE_JUMP_CUT = 0.55;

  // --- FPS ---
  const FPS_RUN = 14;
  const FPS_ROLL = 8;
  const FPS_JUMP = 15;
  const FPS_FALL = 14;
  const FPS_LAND = 15;
  const FPS_DJUMP = 15;
  const FPS_DEAD = 15;

  // --- STATE-MASCHINE ---
  let posY = FLOOR_Y, velY = 0;
  let onGround = true, canDouble = true;
  let coyoteTimer = 0, jumpBufferTimer = 0;
  let isRolling = false, isDead = false, isLanding = false;
  let isStomping = false; 
  let currentSheet = SPRITE_RUN;
  let currentCols = COLS_RUN;
  let currentFps = FPS_RUN;
  let animTime = 0, animCol = 0;
  let lastTime = 0, rafId;
  
  let zombieSpawnTimer = 0;
  let rocketSpawnTimer = 3.0;
  let currentZombieType = ZOMBIE_TYPE_LOW;
  let currentRocketType = ZOMBIE_TYPE_LOW;
  
  let score = 0;
  let scoreInterval;

  // --- Setup ---
  player.style.width = FRAME_W + "px";
  player.style.height = FRAME_H + "px";
  player.style.bottom = `${Math.round(posY + OFFSET_Y)}px`;
  player.style.willChange = "background-position, bottom";

  // --- Input-Handler ---
  const keys = { space:false, down:false };
  document.addEventListener("keydown", e => {
    if (e.code === "Space") { if(!keys.space){ keys.space = true; onJumpPressed(); } e.preventDefault(); }
    if (e.code === "ArrowDown") { if (!keys.down) { keys.down = true; onDownPressed(); } e.preventDefault(); }
  });
  document.addEventListener("keyup", e => {
    if (e.code === "Space") { keys.space = false; }
    if (e.code === "ArrowDown") { keys.down = false; onDownReleased(); }
  });

  // --- Animations-Gehirn (v3.2) ---
  function setSheet(sheet, fps){
    if (currentSheet === sheet || (isDead && sheet !== SPRITE_DEAD)) return; 
    currentSheet = sheet;
    currentFps = fps;
    
    // --- HITBOX-FIX (v7.3) ---
    switch (sheet) {
      case SPRITE_RUN:
        currentCols = COLS_RUN;
        playerHitbox.style.height = "120px";
        break;
      case SPRITE_ROLL:
        currentCols = COLS_ROLL;
        playerHitbox.style.height = "60px";
        break;
      case SPRITE_JUMP:
        currentCols = COLS_JUMP;
        playerHitbox.style.height = "100px";
        break;
      case SPRITE_FALL:
        currentCols = COLS_FALL;
        playerHitbox.style.height = "100px";
        break;
      case SPRITE_LAND:
        currentCols = COLS_LAND;
        playerHitbox.style.height = "90px";
        break;
      case SPRITE_DJUMP:
        currentCols = COLS_DJUMP;
        playerHitbox.style.height = "100px";
        break;
      case SPRITE_DEAD:
        currentCols = COLS_DEAD;
        playerHitbox.style.height = "60px";
        break;
      default:
        currentCols = 1;
        playerHitbox.style.height = "120px";
    }
    
    animTime = 0;
    animCol = 0;
  }
  
  // (Brute-Force Fix v3.2)
  function updateBgPos(){
    const x = -animCol * FRAME_W;
    const y = 0;
    const sheetWidth = currentCols * FRAME_W; 
    player.style.backgroundImage = `url('${currentSheet}')`;
    player.style.backgroundRepeat = "no-repeat";
    player.style.backgroundPosition = `${x}px ${y}px`;
    player.style.backgroundSize = `${sheetWidth}px ${FRAME_H}px`;
  }

  // --- Spieler-Aktionen (v7.2) ---
  function onJumpPressed(){
    if (isLanding || isDead) return;
    jumpBufferTimer = JUMP_BUFFER;
  }
  
  function onDownPressed(){
    if (isDead) return;
    if (onGround && !isLanding) {
      isRolling = true;
      setSheet(SPRITE_ROLL, FPS_ROLL);
    } else if (!onGround) {
      if (!isStomping) {
        velY = -MAX_FALL_SPEED;
        isStomping = true;
      }
    }
  }
  
  function onDownReleased() {
    if (isRolling) {
      isRolling = false;
      if (onGround) setSheet(SPRITE_RUN, FPS_RUN);
    }
  }
  
  function tryConsumeJump(){
    const canFirst = onGround || coyoteTimer > 0;
    if (jumpBufferTimer > 0) {
      if (canFirst) {
        jumpBufferTimer = 0; coyoteTimer = 0; onGround = false; canDouble = true;
        velY = JUMP_VELOCITY;
        setSheet(SPRITE_JUMP, FPS_JUMP);
        return true;
      } else if (canDouble) {
        jumpBufferTimer = 0; canDouble = false;
        velY = DJUMP_VELOCITY;
        setSheet(SPRITE_DJUMP, FPS_DJUMP);
        return true;
      }
    }
    return false;
  }

  // --- ZOMBIE-LOGIK ---
  function spawnZombie() {
    const zombieIndex = Math.floor(Math.random() * 4);
    const zombiePath = ZOMBIE_PATHS[zombieIndex];
    
    let animName = "zombie-walk";
    let animFrames = 10;
    
    if (zombieIndex === 3) {
      currentZombieType = ZOMBIE_TYPE_HIGH;
      animName = "zombie-walk-12";
      animFrames = 12;
    } else {
      currentZombieType = ZOMBIE_TYPE_LOW;
      animName = "zombie-walk";
      animFrames = 10;
    }
    
    const posterWidth = animFrames * FRAME_W;
    zombieObstacle.style.backgroundImage = `url('${zombiePath}')`;
    zombieObstacle.style.backgroundSize = `${posterWidth}px ${FRAME_H}px`;
    
    const animDuration = (1 / ZOMBIE_FPS) * animFrames;
    
    zombieObstacle.style.animation = 'none';
    void zombieObstacle.offsetWidth; 
    
    zombieObstacle.style.animation = `
      obstacle-move ${obstacleSpeed}s linear forwards, 
      ${animName} ${animDuration}s steps(${animFrames}) infinite
    `;
    zombieObstacle.style.animationPlayState = "running";
    zombieSpawnTimer = obstacleSpeed + 0.2 + (Math.random() * 1.5);
  }

  // --- RAKETEN-LOGIK ---
  function spawnRocket() {
    // 50/50 Chance: tief oder hoch
    if (Math.random() > 0.5) {
      rocketObstacle.style.bottom = "1px"; // Tief (Spring drüber)
      currentRocketType = ZOMBIE_TYPE_LOW;
    } else {
      rocketObstacle.style.bottom = "150px"; // Hoch (Roll drunter)
      currentRocketType = ZOMBIE_TYPE_HIGH;
    }

    rocketObstacle.style.animation = 'none';
    void rocketObstacle.offsetWidth;
    
    rocketObstacle.style.animation = `
      rocket-move ${obstacleSpeed * 0.8}s linear forwards
    `; 
    
    rocketObstacle.style.animationPlayState = "running";
    rocketSpawnTimer = obstacleSpeed + 3.0 + (Math.random() * 3.0);
  }


  function checkCollision() {
    if (isDead) return;
    
    const playerRect = playerHitbox.getBoundingClientRect();
    
    // 1. Check Zombie-Kollision
    const zombieRect = zombieHitbox.getBoundingClientRect();
    const isCollidingZombie = playerRect.left < zombieRect.right &&
                              playerRect.right > zombieRect.left &&
                              playerRect.top < zombieRect.bottom &&
                              playerRect.bottom > zombieRect.top;

    if (isCollidingZombie) {
      if (isRolling && currentZombieType === ZOMBIE_TYPE_HIGH) { /* Sicher */ } 
      else {
        triggerGameOver();
        return; 
      }
    }
    
    // 2. Check Raketen-Kollision
    const rocketRect = rocketHitbox.getBoundingClientRect();
    const isCollidingRocket = playerRect.left < rocketRect.right &&
                              playerRect.right > rocketRect.left &&
                              playerRect.top < rocketRect.bottom &&
                              playerRect.bottom > rocketRect.top;

    if (isCollidingRocket) {
      if (isRolling && currentRocketType === ZOMBIE_TYPE_HIGH) { /* Sicher */ } 
      else if (!isRolling && currentRocketType === ZOMBIE_TYPE_LOW) { /* Sicher */ } 
      else {
        triggerGameOver();
        return;
      }
    }
  }


  function triggerGameOver() {
    if (isDead) return;
    isDead = true;
    setSheet(SPRITE_DEAD, FPS_DEAD);
    
    gameWorld.style.animationPlayState = "paused";
    zombieObstacle.style.animationPlayState = "paused";
    rocketObstacle.style.animationPlayState = "paused";
    
    clearInterval(scoreInterval); 
    gameOverScreen.textContent = `GAME OVER (Score: ${score})`;
    gameOverScreen.style.display = "block";
  }

  // --- DER HAUPT-LOOP (Game Loop) ---
  function loop(t){
    if (!lastTime) lastTime = t;
    const dt = Math.min(0.033, (t - lastTime)/1000);
    lastTime = t;

    // Timer
    if (!isDead) {
      if (coyoteTimer > 0) coyoteTimer -= dt;
      if (jumpBufferTimer > 0) jumpBufferTimer -= dt;
      
      zombieSpawnTimer -= dt;
      if (zombieSpawnTimer <= 0) {
        spawnZombie();
      }
      
      rocketSpawnTimer -= dt;
      if (rocketSpawnTimer <= 0) {
        spawnRocket();
      }
    }

    // --- PHYSIK (v7.2) ---
    if (isDead) {
      if (onGround) velY = 0;
      else velY -= GRAVITY * dt;
      posY += velY * dt;
      if (posY <= FLOOR_Y) { posY = FLOOR_Y; onGround = true; }
    
    } else if (isRolling && onGround) { 
      velY = Math.max(velY - GRAVITY*dt*0.2, 0);
    } else {
      tryConsumeJump();
      if (!isStomping) {
        if (!keys.space && velY > 0 && !onGround) velY *= VARIABLE_JUMP_CUT;
        velY -= GRAVITY * dt;
      }
      if (velY < -MAX_FALL_SPEED) velY = -MAX_FALL_SPEED;
    }
    posY += velY * dt;

    // --- STATE-LOGIK (v7.2) ---
    if (posY <= FLOOR_Y) {
      posY = FLOOR_Y;
      velY = 0;
      if (!onGround && !isDead) { 
        onGround = true; canDouble = true;
        
        if (isStomping) {
          isRolling = true;
          isStomping = false;
          setSheet(SPRITE_ROLL, FPS_ROLL);
        } else {
          isLanding = true;
          setSheet(SPRITE_LAND, FPS_LAND);
        }
      }
    } else {
      onGround = false;
      if (!isDead) coyoteTimer = Math.max(coyoteTimer, COYOTE_TIME);
      
      if (velY < 0 && !isLanding && !isDead && !isStomping) {
        if(currentSheet !== SPRITE_FALL && currentSheet !== SPRITE_DJUMP && currentSheet !== SPRITE_JUMP) {
           setSheet(SPRITE_FALL, FPS_FALL);
        }
      }
    }

    // --- ANIMATION ---
    animTime += dt;
    const frameDur = 1/Math.max(1, currentFps);
    
    while (animTime >= frameDur) {
      animTime -= frameDur;
      let isOneShot = (currentSheet === SPRITE_JUMP || currentSheet === SPRITE_DJUMP || currentSheet === SPRITE_LAND || currentSheet === SPRITE_DEAD);
      
      if (isOneShot) {
        if (animCol < currentCols - 1) {
          animCol++;
        } else {
          if (currentSheet === SPRITE_JUMP || currentSheet === SPRITE_DJUMP) {
            setSheet(SPRITE_FALL, FPS_FALL);
          }
          if (currentSheet === SPRITE_LAND) {
            isLanding = false;
            if (keys.down && onGround) {
              isRolling = true;
              setSheet(SPRITE_ROLL, FPS_ROLL);
            } else {
              isRolling = false;
              setSheet(SPRITE_RUN, FPS_RUN);
            }
          }
        }
      } else {
        animCol = (animCol + 1) % currentCols;
      }
    }
    
    // --- RENDER & KOLLISION ---
    updateBgPos(); // Render Emi
    player.style.bottom = `${Math.round(posY + OFFSET_Y)}px`;
    checkCollision();
    
    rafId = requestAnimationFrame(loop);
  }

  // --- Start-Funktion ---
  function start(){
    isDead = false; isLanding = false; isRolling = false; isStomping = false;
    onGround = true; canDouble = true;
    posY = FLOOR_Y; velY = 0;
    coyoteTimer = 0; jumpBufferTimer = 0;
    
    obstacleSpeed = BASE_OBSTACLE_SPEED;
    
    playerHitbox.style.height = "120px"; // Hitbox zurücksetzen

    gameOverScreen.style.display = "none";
    gameWorld.style.animationPlayState = "running";
    
    setSheet(SPRITE_RUN, FPS_RUN); 
    
    zombieObstacle.style.animation = 'none';
    zombieObstacle.style.left = '100%';
    rocketObstacle.style.animation = 'none';
    rocketObstacle.style.left = '100%';
    
    zombieSpawnTimer = 0.5;
    rocketSpawnTimer = 3.0;
    
    // SCORE
    score = 0;
    scoreDisplay.textContent = score;
    clearInterval(scoreInterval); 
    
    scoreInterval = setInterval(() => {
      if (!isDead) {
        score++;
        scoreDisplay.textContent = score;
        
        if (score > 0 && score % SPEED_INCREASE_INTERVAL === 0) {
          if (obstacleSpeed > MIN_OBSTACLE_SPEED) {
            obstacleSpeed -= SPEED_INCREASE_AMOUNT; 
            if (obstacleSpeed < MIN_OBSTACLE_SPEED) {
              obstacleSpeed = MIN_OBSTACLE_SPEED;
            }
          }
        }
      }
    }, 100);

    // Starte den Loop
    cancelAnimationFrame(rafId); 
    lastTime = 0;
    rafId = requestAnimationFrame(loop);
  }
  
  // --- PRELOADER (v7.3) ---
  function preloadImages() {
    console.log(`Preloading ${ALL_SPRITES.length} images...`);
    
    const promises = ALL_SPRITES.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Konnte ${src} nicht laden`);
        img.src = src;
      });
    });
    
    return Promise.all(promises);
  }
  
  // Event Listener
  document.addEventListener("keydown", e => { 
    if (e.code === "KeyR") start();
    if (e.code === "Space" && isDead) {
      e.preventDefault();
      start();
    }
  });
  window.addEventListener("blur", ()=> cancelAnimationFrame(rafId));
  window.addEventListener("focus", ()=> { lastTime=0; rafId=requestAnimationFrame(loop); });

  // --- Spiel starten! (v7.3) ---
  preloadImages().then(() => {
    console.log("Alle Bilder geladen. Spiel startet!");
    start(); // Starte das Spiel
  }).catch(err => {
    console.error("Fehler beim Vorladen der Bilder:", err);
    start(); 
  });
  
} // Ende des if (gameWorld) Blocks