
let playerText = document.getElementById("heading");
let restartBtn = document.getElementById("restart");
let strike = document.getElementById("strike");
let boxes = Array.from(document.getElementsByClassName("box"));
let gameOver = document.getElementById("hidden");

const mainMenu = document.getElementById("main-menu");
const oSound = new Audio("./circle.mp3");
const xSound = new Audio("./cross.mp3");

oSound.playbackRate = 1.5;

const x_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <path id="path1" d="M10,10 L90,90" stroke="orange" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path id="path2" d="M90,10 L10,90" stroke="orange" stroke-width="10" stroke-linecap="round" fill="none"/>
      </svg>`;

const o_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="none" stroke="orange" stroke-width="10" stroke-linecap="round" id="circle"></circle>
  </svg>
  `;

player.current = null;
const O_TEXT = "O";
const X_TEXT = "X";
let board = Array(9).fill(null);
let isGameOver = false;

function arraysEqual(a, b) {
  return a.length == b.length && a.every((val, index) => val === b[index]);
}

function drawWinningLine(winning_blocks) {
  if (
    arraysEqual(winning_blocks, [0, 1, 2]) ||
    arraysEqual(winning_blocks, [3, 4, 5]) ||
    arraysEqual(winning_blocks, [6, 7, 8])
  ) {
    strike.classList.add("strike-row");
    strike.classList.add(`strike-row-${winning_blocks[0]}`);
    // console.log(winning_blocks);
  } else if (
    arraysEqual(winning_blocks, [0, 3, 6]) ||
    arraysEqual(winning_blocks, [1, 4, 7]) ||
    arraysEqual(winning_blocks, [2, 5, 8])
  ) {
    strike.classList.add("strike-col");
    strike.classList.add(`strike-col-${winning_blocks[0]}`);
    // console.log(winning_blocks);
  } else {
    strike.classList.add(`strike-diagonal-${winning_blocks[0]}`);
    strike.classList.add("strike-diagonal");
    // console.log(winning_blocks);
  }
}

function boxClicked(e) {
  if (isGameOver || (player.computer && player.current !== player.man)) return;

  const id = e.target.id;
  if (!board[id]) {
    board[id] = player.current;
    e.target.innerHTML = player.current === X_TEXT ? x_svg : o_svg;
    player.current === X_TEXT ? xSound.play() : oSound.play();

    if (checkWinner() && checkWinner()[1] === player.current) {
      let winning_blocks = checkWinner()[0];
      drawWinningLine(winning_blocks);
      gameOver.classList.remove("hidden");
      gameOver.classList.add("visible");
      gameOver.innerText = `${
        player.computer ? "You" : "Player " + player.current
      } won!`;
      isGameOver = true;
    } else if (checkDraw(board)) {
      gameOver.classList.remove("hidden");
      gameOver.classList.add("visible");
      gameOver.innerText = "Draw";
      isGameOver = true;
    } else if (player.computer) {
      // Switch to computer's turn
      player.current = player.computer;
      setTimeout(computerMove, 500); // Small delay for better UX
    } else {
      // If playing against a friend, switch turns
      player.current = player.current === X_TEXT ? O_TEXT : X_TEXT;
    }
  }
}

function computerMove() {
  if (isGameOver) return;

  const bestMove = findBestMove(board, player.computer);

  // Make the move
  board[bestMove] = player.computer;
  const box = document.getElementById(bestMove.toString());
  if (player.computer === X_TEXT) {
    box.innerHTML = x_svg;
    xSound.play();
  } else {
    box.innerHTML = o_svg;
    oSound.play();
  }

  // Check for win or draw
  if (checkWinner()) {
    let winning_blocks = checkWinner()[0];
    drawWinningLine(winning_blocks);
    gameOver.classList.remove("hidden");
    gameOver.classList.add("visible");
    gameOver.innerText = `Computer won!`;
    isGameOver = true;
  } else if (!board.includes(null)) {
    gameOver.classList.remove("hidden");
    gameOver.classList.add("visible");
    gameOver.innerText = "Draw";
    isGameOver = true;
  } else {
    // Switch turn back to player
    player.current = player.man;
  }
}

function findBestMove(board, player) {
  let bestScore = player === player.computer ? -Infinity : Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = player;
      let score = minimax(board, 0, false, player);
      board[i] = null;

      if (player === player.computer) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, currentTurn) {
  const opponent =
    currentTurn === player.computer ? player.man : player.computer;

  // Check for terminal states
  const winner = checkWinner();
  if (winner && winner[1] === player.computer) return 10 - depth;
  if (winner && winner[1] === player.man) return depth - 10;
  if (checkDraw(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = player.computer; // AI makes a move
        let score = minimax(board, depth + 1, false, opponent); // Opponent's turn next
        board[i] = null; // Undo the move
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = player.man; // Opponent makes a move
        let score = minimax(board, depth + 1, true, currentTurn); // AI's turn next
        board[i] = null; // Undo the move
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [pattern, board[a]];
    }
  }
  return null;
}

function checkDraw(board) {
  return !board.includes(null);
}

restartBtn.addEventListener("click", startGame);

function startGame() {
  if (checkWinner()) {
    let winning_list = checkWinner()[0];
    if (strike.classList.contains(`strike-row-${winning_list[0]}`)) {
      strike.classList.remove("strike-row");
      strike.classList.remove(`strike-row-${winning_list[0]}`);
    } else if (strike.classList.contains(`strike-col-${winning_list[0]}`)) {
      strike.classList.remove("strike-col");
      strike.classList.remove(`strike-col-${winning_list[0]}`);
    } else {
      strike.classList.remove("strike-diagonal");
      strike.classList.remove(`strike-diagonal-${winning_list[0]}`);
    }
  }
  gameOver.classList.remove("visible");
  gameOver.classList.add("hidden");
  board.fill(null);
  isGameOver = false;

  boxes.forEach((box) => {
    box.innerText = "";
    box.style.backgroundColor = "";
    box.classList.remove(X_TEXT);
    box.classList.remove(O_TEXT);
    box.addEventListener("click", boxClicked);
  });

  if (myTurn) {
    console.log(myTurn);
    myTurn = false;
    player.current = player.man;
  } else {
    console.log(myTurn);
    myTurn = true;
    if (player.computer) {
      player.current = player.man;
      setTimeout(computerMove, 500);
    } else {
      player.current = player.man == X_TEXT ? O_TEXT : X_TEXT;
    }
  }
  // console.log(player);
  playerText = "Tic Tac Toe";
}

mainMenu.addEventListener("click", menu);

function menu() {
  gameboard.style.display = "none";
  options.style.display = "flex";
  restartBtn.classList.add("hidden");
  gameOver.classList.remove("visible");
  mainMenu.classList.remove("visible");
  mainMenu.classList.add("hidden");
  gameOver.classList.add("hidden");
  // player = {};
  myTurn = true;
  player.current = null;
  player.man = null;
  player.computer = null;
  player.friend = null;

  // console.log(player);
}

