const CANVAS_SIZE = 800;

const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 22;

const MINO_SIZE = 4;
const BLOCK_SIZE = 30;
const ORIGIN = 80;
const DROP_SPEED = 300;
var context = document.querySelector("canvas").getContext("2d");

let minoX = 0;
let minoY = 0;
let mino;
let gameOver = false;
let lineCount = 0;
let minoType;

let field = [ 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1], 
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

let minos = [
  [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 3, 3, 0],
    [0, 3, 3, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 4, 4, 0],
    [4, 4, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [5, 5, 0, 0],
    [0, 5, 5, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 6, 0],
    [6, 6, 6, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [7, 0, 0, 0],
    [7, 7, 7, 0],
    [0, 0, 0, 0],
  ],
];

let minoColors = [
  "#EE82EE",
  "#87CEFA",
  "#FFD700",
  "#90EE90",
  "#FA8072",
  "#FFA500",
  "#4169E1",
];

function drawField() {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (let y = 1; y < FIELD_HEIGHT; y ++) {
    for (let x = 0; x < FIELD_WIDTH; x ++) {
      context.fillStyle = "#F5F5DC";
      context.strokeStyle = "#F5F5F5";
      if (field[y][x] === -1) context.fillStyle = "#797979";
      if (field[y][x]) context.fillStyle = minoColors[field[y][x] - 1];
      context.fillRect(ORIGIN + x * BLOCK_SIZE, ORIGIN + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      context.strokeRect(ORIGIN + x * BLOCK_SIZE, ORIGIN + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
  if (gameOver) {
    context.font = "60px serif";
    context.fillStyle = "#191970";
    context.fillText("GAME OVER", 60, 400);
  }
}

function drawMino(mino) {
  for (let y = 0; y < MINO_SIZE; y ++ ) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      context.fillStyle = minoColors[minoType];
      context.strokeStyle = "#F5F5F5";
      if (mino[y][x]) {
        let px = ORIGIN + (4 * BLOCK_SIZE) + (x + minoX) * BLOCK_SIZE;
        let py = ORIGIN + (y + minoY) * BLOCK_SIZE;
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE); 
        context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      }  
    }
  }
}

function drawScore() {
  context.fillStyle = "#000000";
  context.font = "24px serif";
  context.fillText("SCORE: " + lineCount, 500, 600);
  context.fillText("Left: A", 500, 200);
  context.fillText("Right: D", 500, 250);
  context.fillText("Down: S", 500, 300);
  context.fillText("Rotate Right: K", 500, 350);
  context.fillText("Rotate Left: J", 500, 400);
}

function canMove(mx, my, mino) {
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      let nx = mx + minoX + x + 4; 
      let ny = my + minoY + y;
      if ((field[ny][nx] === -1 || field[ny][nx]) && (mino[y][x])) {
        return false;
      }
    }
  }
  return true;
}

function turnLeft(mino) {
  let turned = [];
  for (let y = 0; y < MINO_SIZE; y ++) {
    turned[y] = [];
    for (let x = 0; x < MINO_SIZE; x ++) {
        turned[y][x] = mino[x][MINO_SIZE - 1 - y];
    }
  }
  return turned;
}

function turnRight(mino) {
  let turned = [];
  for (let y = 0; y < MINO_SIZE; y ++) {
    turned[y] = [];
    for (let x = 0; x < MINO_SIZE; x ++) {
        turned[y][x] = mino[MINO_SIZE - 1 - x][y];
    }
  }
  return turned;
}
  
function canTurn(mino, isLeft) {
  let turned;
  if (isLeft) {
  turned = turnLeft(mino);
  } else {
  turned = turnRight(mino);
  }
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      let nx = minoX + x + 4; 
      let ny = minoY + y;
      if ((field[ny][nx] === -1 || field[ny][nx]) && (turned[y][x])) {
        return false;
      }
    }
  }
  return true;
}

function fixMino() {
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      if (mino[y][x]) {
        field[y + minoY][x + minoX + 4] = minoType + 1;
      }
    }
  }
}

function makeMino() {
  minoType = Math.floor(Math.random() * 7);
  mino = minos[minoType];
  minoX = 0;
  minoY = 0;
}

function deleteLine() {
  for (let y = 1; y < FIELD_HEIGHT; y ++) {
    let check = true;
    for (let x = 1; x < FIELD_WIDTH - 1; x ++) {
      if (field[y][x] === 0 || field[y][x] === -1) {
        check = false;
      }
    }
    let deleteCount = 0;
    if (check) {
      deleteCount ++;
      lineCount += deleteCount;
      for (let ny = y; ny > 0; ny --) {
        for (let x = 1; x < FIELD_WIDTH - 1; x ++) {
          field[ny][x] = field[ny - deleteCount][x];
        }
      }
    }
  }
}

function dropMino() {
  if (gameOver) return ;
  if (canMove(0, 1, mino)) {
    minoY++;
  } else {
    fixMino();
    deleteLine();
    makeMino();
    if (!canMove(0, 0, mino)) {
     gameOver = true; 
    }
  }
  drawField();
  drawMino(mino);
  drawScore();
}

document.onkeydown = function(e) {
  if (gameOver) return ;
  switch(e.keyCode) {
    case 87:
      if (canMove(0, -1, mino)) minoY --;
      break;
    case 65:
      if (canMove(-1, 0, mino)) minoX --;
      break;
    case 68:
      if (canMove(1, 0, mino)) minoX ++;
      break;
    case 83:
      if (canMove(0, 1, mino)) minoY ++;
      break;
    case 74:
      if (canTurn(mino, true)) mino = turnLeft(mino);
      break;
    case 75:
      if (canTurn(mino, false)) mino = turnRight(mino);
      break;
  }
  drawField();
  drawMino(mino);
  drawScore();
}

makeMino();
drawField();
drawMino(mino);
drawScore();
setInterval(dropMino, DROP_SPEED);


