const CANVAS_SIZE = 800;

const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 22;

const MINO_SIZE = 4;
const BLOCK_SIZE = 30;
const ORIGIN = 80;
const DROP_SPEED = 300;
var context = document.querySelector("canvas").getContext("2d");

var field = [ 
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
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

function drawField() {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  for (let y = 1; y < FIELD_HEIGHT; y ++) {
    for (let x = 0; x < FIELD_WIDTH; x ++) {
      context.fillStyle = "#000000";
      context.strokeStyle = "#F5F5F5";
      if (field[y][x] === -1) context.fillStyle = "#797979";
      if (field[y][x] === 1) context.fillStyle = "#FF0000";
      context.fillRect(ORIGIN + x * BLOCK_SIZE, ORIGIN + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      context.strokeRect(ORIGIN + x * BLOCK_SIZE, ORIGIN + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

let minoX = 0;
let minoY = 0;
let mino;
function drawMino(mino) {
  for (let y = 0; y < MINO_SIZE; y ++ ) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      context.fillStyle = "#FF0000";
      context.strokeStyle = "#F5F5F5";
      if (mino[y][x] == 1) {
        let px = ORIGIN + (4 * BLOCK_SIZE) + (x + minoX) * BLOCK_SIZE;
        let py = ORIGIN + (y + minoY) * BLOCK_SIZE;
        context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE); 
        context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      }  
    }
  }
}

function canMove(mx, my, mino) {
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      let nx = mx + minoX + x + 4; 
      let ny = my + minoY + y;
      if ((field[ny][nx] === -1 || field[ny][nx] === 1) && (mino[y][x] === 1)) {
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
      if ((field[ny][nx] === -1 || field[ny][nx] === 1) && (turned[y][x] === 1)) {
        return false;
      }
    }
  }
  return true;
}

function fixMino() {
  for (let y = 0; y < MINO_SIZE; y ++) {
    for (let x = 0; x < MINO_SIZE; x ++) {
      if (mino[y][x] == 1) {
        field[y + minoY][x + minoX + 4] = 1;
      }
    }
  }
}

function makeMino() {
  const minoType = Math.floor(Math.random() * 7);
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
      for (let ny = y; ny > 0; ny --) {
        for (let x = 1; x < FIELD_WIDTH - 1; x ++) {
          field[ny][x] = field[ny - deleteCount][x];
        }
      }
    }
  }
}
function dropMino() {
  if (canMove(0, 1, mino)) {
    minoY++;
  } else {
    fixMino();
    deleteLine();
    makeMino();
  }
  drawField();
  drawMino(mino);
}

document.onkeydown = function(e) {
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
}

makeMino();
drawField();
drawMino(mino);
setInterval(dropMino, DROP_SPEED);







