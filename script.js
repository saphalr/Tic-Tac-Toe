let playerText = document.getElementById("heading");
let restartBtn = document.getElementById("restart");
let strike = document.getElementById("strike");
let boxes = Array.from(document.getElementsByClassName("box"));
let gameOver = document.getElementById("hidden");

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let isGameOver = false;

const startGame = () => {
  boxes.forEach((box) => {
    box.addEventListener("click", boxClicked);
    });
}

function arraysEqual(a, b) {
  return a.length == b.length && a.every((val, index) => val === b[index]);
}

function boxClicked(e) {
    if (isGameOver) return;
  const id = e.target.id;
  if (!spaces[id]) {
    spaces[id] = currentPlayer;
    if (currentPlayer === X_TEXT) {
        e.target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <path id="path1" d="M10,10 L90,90" stroke="orange" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path id="path2" d="M90,10 L10,90" stroke="orange" stroke-width="10" stroke-linecap="round" fill="none"/>
      </svg>
        `;
    } else {
      e.target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="none" stroke="orange" stroke-width="10" stroke-linecap="round" id="circle"></circle>
  </svg>
  `;
    }
    if(!(spaces.includes(null))){
        gameOver.classList.remove('hidden');
        gameOver.classList.add('visible');
        gameOver.innerText="Draw";
        isGameOver = true;
    }
    if (playerHasWon() != false) {
      let winning_blocks = playerHasWon();
      if (
        arraysEqual(winning_blocks, [0, 1, 2]) ||
        arraysEqual(winning_blocks, [3, 4, 5]) ||
        arraysEqual(winning_blocks, [6, 7, 8])
      ) {
        strike.classList.add('strike-row');
        strike.classList.add(`strike-row-${winning_blocks[0]}`);
        console.log(winning_blocks);
      } else if (
        arraysEqual(winning_blocks, [0, 3, 6]) ||
        arraysEqual(winning_blocks, [1, 4, 7]) ||
        arraysEqual(winning_blocks, [2, 5, 8])
      ) {
        strike.classList.add('strike-col');
        strike.classList.add(`strike-col-${winning_blocks[0]}`);
        console.log(winning_blocks);
      } else {
        strike.classList.add(`strike-diagonal-${winning_blocks[0]}`);
        strike.classList.add('strike-diagonal');
        console.log(winning_blocks);
      }
      gameOver.classList.remove('hidden');
      gameOver.classList.add('visible');
      gameOver.innerText=`${currentPlayer} won!`;
      isGameOver = true;
      return;
    }
    currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
  }
}

restartBtn.addEventListener("click", restart);

function restart() {
  if (playerHasWon() != false) {
    let winning_list = playerHasWon();
    if (strike.classList.contains(`strike-row-${winning_list[0]}`)) {
    strike.classList.remove('strike-row');
      strike.classList.remove(`strike-row-${winning_list[0]}`);
    } else if (strike.classList.contains(`strike-col-${winning_list[0]}`)) {
        strike.classList.remove('strike-col');
      strike.classList.remove(`strike-col-${winning_list[0]}`);
    } else {
        strike.classList.remove('strike-diagonal');
      strike.classList.remove(`strike-diagonal-${winning_list[0]}`);
    }
  }
  gameOver.classList.remove('visible');
  gameOver.classList.add('hidden');
  spaces.fill(null);
  isGameOver = false;
  boxes.forEach((box) => {
    box.innerText = "";
    box.style.backgroundColor = "";
    box.classList.remove(X_TEXT);
    box.classList.remove(O_TEXT);
  });

  currentPlayer = X_TEXT;

  playerText = "Tic Tac Toe";
}

const winArray = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];
function playerHasWon() {
  for (const condition of winArray) {
    let [a, b, c] = condition;
    if (spaces[a] && spaces[a] == spaces[b] && spaces[a] == spaces[c]) {
      return [a, b, c];
    }
  }
  return false;
}



startGame();
