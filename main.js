const CANVAS_SIZE_X = 1600;
const CANVAS_SIZE_Y = 800;
const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 22;
const MINO_SIZE = 4;
const BLOCK_SIZE = 30;
const ORIGIN_X = 650;
const ORIGIN_Y = 80;
const DROP_SPEED = 300;

var context = document.querySelector("canvas").getContext("2d");

let minoX = 0;
let minoY = 0;
let mino;
let hold;
let holdColor = null;
let minoColor = null;
let gameOver = false;
let lineCount = 0
let minoType;
let holded = false;
let used = [false, false, false, false, false, false, false];

function initUsed() { 
  used = [false, false, false, false, false, false, false];
}

function isAllUsed() {
  for (let i = 0; i < 7; i++) {
    if (!used[i]) return false;
  }
  return true;
}

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

let holdSpace;
function initHold() {
  holdSpace = [
    [-1, -1, -1, -1, -1, -1],
    [-1,  0,  0,  0,  0, -1],
    [-1,  0,  0,  0,  0, -1],
    [-1,  0,  0,  0,  0, -1],
    [-1,  0,  0,  0,  0, -1],
    [-1, -1, -1, -1, -1, -1],
  ];
};

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
  context.clearRect(0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);
  for (let y = 1; y < FIELD_HEIGHT; y ++) {
    for (let x = 0; x < FIELD_WIDTH; x ++) {
      context.fillStyle = "#F5F5DC";
      context.strokeStyle = "#D3D3D3";
      if (field[y][x] === -1) {
        context.fillStyle = "#797979"
        context.strokeStyle = "#F5F5F5"
      }
      if (field[y][x]) context.fillStyle = minoColors[field[y][x] - 1];
      context.fillRect(ORIGIN_X + x * BLOCK_SIZE, ORIGIN_Y + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      context.strokeRect(ORIGIN_X + x * BLOCK_SIZE, ORIGIN_Y + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
  if (gameOver) {
    context.font = "60px serif";
    context.fillStyle = "#191970";
    context.fillText("GAME OVER", ORIGIN_X - 20, 400);
  }
}

function drawMino(mino) {
  for (let y = 0; y < MINO_SIZE; y ++ ) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      context.fillStyle = minoColors[minoType];
      context.strokeStyle = "#D3D3D3";
      if (mino[y][x]) {
        let px = ORIGIN_X + (4 * BLOCK_SIZE) + (x + minoX) * BLOCK_SIZE;
        let py = ORIGIN_Y + (y + minoY) * BLOCK_SIZE;
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE); 
        context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      }  
    }
  }
}

function drawHold() {
  for (let y = 0; y < 6; y ++) {
    for (let x = 0; x < 6; x ++) {
      context.fillStyle = "#F5F5DC";
      context.strokeStyle = "#F5F5DC";
      if (holdSpace[y][x] === -1) {
        context.fillStyle = "#797979"
        context.strokeStyle = "#F5F5F5"
      } else if (holdSpace[y][x]) {
        context.fillStyle = minoColors[holdColor];
      }
      context.fillRect(ORIGIN_X + (x - 7) * BLOCK_SIZE, ORIGIN_Y + (y + 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      context.strokeRect(ORIGIN_X + (x - 7) * BLOCK_SIZE, ORIGIN_Y + (y + 1) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawScore() {
  context.fillStyle = "#000000";
  context.font = "24px serif";
  context.fillText("SCORE: " + lineCount, ORIGIN_X + 400, ORIGIN_Y + 500);
  context.fillText("Move Left: A", ORIGIN_X + 400, ORIGIN_Y + 100);
  context.fillText("Move Right: D", ORIGIN_X + 400, ORIGIN_Y + 150);
  context.fillText("Move Down: S", ORIGIN_X + 400, ORIGIN_Y + 200);
  context.fillText("Rotate Right: K", ORIGIN_X + 400, ORIGIN_Y + 250);
  context.fillText("Rotate Left: J", ORIGIN_X + 400, ORIGIN_Y + 300);
  context.fillText("Hold: Space", ORIGIN_X + 400, ORIGIN_Y + 350);
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
  if (isAllUsed()) initUsed();
  while (true) {
    minoType = Math.floor(Math.random() * 7);
    if (!used[minoType]) {
      used[minoType] = true;
      break;
    }
  }
  mino = minos[minoType];
  minoX = 0;
  minoY = 0;
}

function deleteLine() {
  for (let y = 1; y < FIELD_HEIGHT - 1; y ++) {
    let check = true;
    for (let x = 1; x < FIELD_WIDTH - 1; x ++) {
      if (field[y][x] === 0) {
        check = false;
      }
    }
    if (check) {
      lineCount += 1;
      for (let ny = y; ny > 0; ny --) {
        for (let x = 1; x < FIELD_WIDTH - 1; x ++) {
          field[ny][x] = field[ny - 1][x];
        }
      }
    }
  }
}

function holdMino() {
  if (holded) return ;
  let tmp = hold;
  hold = minos[minoType];
  if (holdColor === null) {
    holdColor = minoType;
    makeMino();
    for (let y = 0; y < MINO_SIZE; y ++) {
      for (let x = 0; x < MINO_SIZE; x ++) {
        if (hold[y][x]) {
          holdSpace[y + 1][x + 1] = hold[y][x];
        }
      }
    }
    holded = true;
    return ;
  }
  mino = tmp;
  tmp = holdColor;
  holdColor = minoType;
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      if (hold[y][x]) {
        holdSpace[y + 1][x + 1] = hold[y][x];
      }
    }
  }
  minoType = tmp;
  minoX = 0;
  minoY = 0;
  holded = true;
}

function dropMino() {
  if (gameOver) return ;
  if (canMove(0, 1, mino)) {
    minoY++;
  } else {
    fixMino();
    holded = false;
    deleteLine();
    makeMino();
    if (!canMove(0, 0, mino)) {
     gameOver = true; 
    }
  }
  drawField();
  drawMino(mino);
  drawScore();
  drawHold();
}

document.onkeydown = function(e) {
  if (gameOver) return ;
  switch(e.keyCode) {
    case 32:
      if (!holded) {
        initHold();
        holdMino();
      }  
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
  drawHold();
}

initHold();
makeMino();
drawField();
drawMino(mino);
drawScore();
drawHold();
setInterval(dropMino, DROP_SPEED);


