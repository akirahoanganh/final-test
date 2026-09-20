const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

let board = [...solvedBoard];

let gameRunning = false;

let seconds = 0;
let timerInterval = null;

let moveCount = 0;

const tileColors = [
  "green",
  "red",
  "blue",
  "purple",
  "yellow",
  "pink",
  "indigo",
  "gray",
  "emerald",
  "amber",
  "lime",
];

const boardElement = document.getElementById("board");
const startBtn = document.getElementById("startBtn");
const timerElement = document.getElementById("timer");
const historyBody = document.getElementById("historyBody");
const messageElement = document.getElementById("message");

function renderBoard() {
  boardElement.innerHTML = "";

  board.forEach((number, index) => {
    const tile = document.createElement("div");

    tile.classList.add("tile");

    if (number === 0) {
      tile.classList.add("empty");
    } else {
      tile.classList.add(tileColors[number - 1]);

      tile.textContent = number;

      tile.addEventListener("click", function () {
        if (!gameRunning) return;

        moveTileByClick(index);
      });
    }

    boardElement.appendChild(tile);
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);

  const secondsLeft = totalSeconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(secondsLeft).padStart(2, "0")
  );
}

function startTimer() {
  clearInterval(timerInterval);

  seconds = 0;

  timerElement.textContent = "00:00";

  timerInterval = setInterval(function () {
    seconds++;

    timerElement.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);

  timerInterval = null;
}

function getEmptyIndex() {
  return board.indexOf(0);
}

function canMove(direction) {
  const emptyIndex = getEmptyIndex();

  const row = Math.floor(emptyIndex / 4);
  const col = emptyIndex % 4;

  if (direction === "up") {
    return row > 0;
  }

  if (direction === "down") {
    return row < 2;
  }

  if (direction === "left") {
    return col > 0;
  }

  if (direction === "right") {
    return col < 3;
  }

  return false;
}

function move(direction, recordHistory = true) {
  if (!canMove(direction)) {
    return false;
  }

  const emptyIndex = getEmptyIndex();

  let targetIndex;

  if (direction === "up") {
    targetIndex = emptyIndex - 4;
  } else if (direction === "down") {
    targetIndex = emptyIndex + 4;
  } else if (direction === "left") {
    targetIndex = emptyIndex - 1;
  } else if (direction === "right") {
    targetIndex = emptyIndex + 1;
  }

  [board[emptyIndex], board[targetIndex]] = [
    board[targetIndex],
    board[emptyIndex],
  ];

  renderBoard();

  if (recordHistory) {
    moveCount++;

    addHistory(moveCount, seconds);
  }

  if (gameRunning && isSolved()) {
    finishGame(true);
  }

  return true;
}

function moveTileByClick(index) {
  const emptyIndex = getEmptyIndex();

  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  const tileRow = Math.floor(index / 4);
  const tileCol = index % 4;

  if (Math.abs(emptyRow - tileRow) + Math.abs(emptyCol - tileCol) !== 1) {
    return;
  }

  if (tileRow < emptyRow) {
    move("up");
  } else if (tileRow > emptyRow) {
    move("down");
  } else if (tileCol < emptyCol) {
    move("left");
  } else if (tileCol > emptyCol) {
    move("right");
  }
}

function shuffleBoard() {
  let previousMove = null;

  for (let i = 0; i < 100; i++) {
    const possibleMoves = ["up", "down", "left", "right"].filter(
      (direction) => {
        return (
          canMove(direction) && direction !== oppositeDirection(previousMove)
        );
      },
    );

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    move(randomMove, false);

    previousMove = randomMove;
  }
}

function oppositeDirection(direction) {
  if (direction === "up") return "down";

  if (direction === "down") return "up";

  if (direction === "left") return "right";

  if (direction === "right") return "left";

  return null;
}

function isSolved() {
  return board.every(function (value, index) {
    return value === solvedBoard[index];
  });
}

function addHistory(step, time) {
  const row = document.createElement("div");

  row.className = "history-row";

  row.innerHTML = `
        <div>${step}</div>
        <div>${formatTime(time)}</div>
    `;

  historyBody.appendChild(row);
}

function clearHistory() {
  historyBody.innerHTML = "";
}

function startGame() {
  stopTimer();

  board = [...solvedBoard];

  moveCount = 0;

  clearHistory();

  messageElement.textContent = "";

  shuffleBoard();

  renderBoard();

  gameRunning = true;

  startBtn.textContent = "Kết thúc";

  startBtn.classList.add("end");

  startTimer();
}

function finishGame(completed = false) {
  gameRunning = false;

  stopTimer();

  if (completed) {
    alert("🎉 Bạn đã hoàn thành!");
  } else {
    alert("Lượt chơi đã kết thúc.");
  }

  startBtn.textContent = "Bắt đầu";

  startBtn.classList.remove("end");
}

startBtn.addEventListener("click", function () {
  if (gameRunning) {
    finishGame(false);
  } else {
    startGame();
  }
});

document.addEventListener("keydown", function (event) {
  if (!gameRunning) return;

  const key = event.key.toLowerCase();

  if (key === "w" || event.key === "ArrowUp") {
    event.preventDefault();

    move("up");
  } else if (key === "s" || event.key === "ArrowDown") {
    event.preventDefault();

    move("down");
  } else if (key === "a" || event.key === "ArrowLeft") {
    event.preventDefault();

    move("left");
  } else if (key === "d" || event.key === "ArrowRight") {
    event.preventDefault();

    move("right");
  }
});

renderBoard();
