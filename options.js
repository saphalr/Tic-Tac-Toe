const options = document.querySelector(".options");
const computerBtn = document.querySelector(".computer");
const friendBtn = document.querySelector(".friend");
const xBtn = document.querySelector(".x");
const oBtn = document.querySelector(".o");
const playBtn = document.querySelector(".play");
const mainMenuBtn = document.getElementById("main-menu");
const gameboard = document.getElementById("gameboard");
const opts = document.getElementById("options");
let player = new Object();

let opponent;
let compSelected = false;
let friendSelected = false;
let xSelected = false;
let oSelected = false;
let myTurn = true;

computerBtn.addEventListener("click", () => {
  opponent = "computer";
  if (!compSelected) {
    if (friendSelected) {
      friendBtn.classList.remove("selected");
    }
    computerBtn.classList.add("selected");
    compSelected = true;
    friendSelected = false;
    player.computer = true;  // Set computer as the opponent
  }
});

friendBtn.addEventListener("click", () => {
  opponent = "friend";
  if (!friendSelected) {
    if (compSelected) {
      computerBtn.classList.remove("selected");
    }
    friendBtn.classList.add("selected");
    friendSelected = true;
    compSelected = false;
    player.computer = false;  // Set friend as the opponent
  }
});

xBtn.addEventListener("click", () => {
  player.man = "X";  // Player is X
  player.current = "X";  // Current player starts as X
  if (opponent === "computer") {
    player.computer = "O";  // Computer will play as O
  } else {
    player.friend = "O";  // Friend will play as O
  }
  if (!xSelected) {
    if (oSelected) {
      oBtn.classList.remove("selected");
    }
    xBtn.classList.add("selected");
    xSelected = true;
    oSelected = false;
  }
});

oBtn.addEventListener("click", () => {
  player.man = "O";  // Player is O
  player.current = "O";  // Current player starts as O
  if (opponent === "computer") {
    player.computer = "X";  // Computer will play as X
  } else {
    player.friend = "X";  // Friend will play as X
  }
  if (!oSelected) {
    if (xSelected) {
      xBtn.classList.remove("selected");
    }
    oBtn.classList.add("selected");
    oSelected = true;
    xSelected = false;
  }
});

playBtn.addEventListener("click", () => {
  if (xSelected || oSelected) {
    startGame();  // Start the game
    gameboard.style.display = "flex";
    gameboard.style.flexWrap = "wrap";
    restartBtn.classList.remove("hidden");
    opts.style.display = "none";
    mainMenuBtn.classList.remove("hidden");

    if (xSelected) xBtn.classList.remove("selected");
    else oBtn.classList.remove("selected");

    if (friendSelected) friendBtn.classList.remove('selected');
    else computerBtn.classList.remove('selected');

    xSelected = oSelected = friendSelected = compSelected = false;
  }
});
