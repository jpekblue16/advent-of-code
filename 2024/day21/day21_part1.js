const { dir } = require('node:console');
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day21_input.txt'),
  output: process.stdout,
  terminal: false,
});

class vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(addVec) {
    try {
      return new vec(this.x + addVec.x, this.y + addVec.y);
    } catch (e) {
      throw e;
    }
  }

  neg() {
    return new vec(-this.x, -this.y);
  }

  isEqual(otherVec) {
    return this.x == otherVec.x && this.y == otherVec.y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

// determine sequence of inputs for multiple layers of entering codes

// layer 1 - number keypad

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
*/

// layer 2 & 3 - arrow keypad

/*
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/

// 5 codes to read, calculate "complexity" for each and sum
// complexity = shortest length of total commands needed * numeric part of code
// eg 029A with command length of 68 gives complexity of 29 * 68 = 1972
var total = 0;
file.on('line', (line) => {
  // for each code

  // get keypad commands
  var keypadCommands = getCommands(line, 'num');

  // get first layer of arrow commands
  var layer1Arrows = getCommands(keypadCommands, 'arrow');

  // get final commands from second layer of arrow commands
  var layer2Arrows = getCommands(layer1Arrows, 'arrow');

  var codeValue = parseInt(line.substring(0, line.length - 1));

  total += codeValue * layer2Arrows.length;
});

file.on('close', () => {
  console.log(total);
});

/***************** KEYPAD *********************/

/*
var keypad = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
  [null, 0, -1],
];
*/

// returns a string of the directions needed to move to enter the given code string
// code will always end with A
function getCommands(code, mode) {
  var result = '';

  // always start at A
  var start = mode == 'num' ? new vec(2, 3) : new vec(2, 0);

  for (var c of code) {
    // get the location of the next code character
    var end = mode == 'num' ? getKeypadLocation(c) : getArrowLocation(c);

    // get the moves required to move from start to end
    result +=
      mode == 'num' ? getKeypadMoves(start, end) : getArrowMoves(start, end);

    // next move starts from the end
    start = end;
  }

  return result;
}

// returns a vector location of the given char
function getKeypadLocation(c) {
  if (c == 'A') return new vec(2, 3);
  if (c == '0') return new vec(1, 3);

  var result = new vec(0, 0);

  // get column using mod 3 - 3,6,9 will be 2, 2,5,8 will be 1, 1,4,7 will be 0
  switch (parseInt(c) % 3) {
    case 0:
      result.x = 2;
      break;
    case 1:
      result.x = 0;
      break;
    case 2:
      result.x = 1;
      break;
  }

  // get row using ceil division
  // 7,8,9 - 0
  // 4,5,6 - 1
  // 1,2,3 - 2
  result.y = 3 - Math.ceil(parseInt(c) / 3);

  return result;
}

// find moves to get from the start point to the end point
// point (3,0) is not traversible (and will never be given as argument)
// move will always end with A press to confirm entry
function getKeypadMoves(start, end) {
  // because of arrow pad layout, want to end each move at either ^ or >
  // don't want to change directions
  // always want to do left first (unless moving from bottom row to first col)
  // if moving from first col to last row or from last row, have to do horizontal first
  if (
    (start.x == 0 && end.y == 3) ||
    (end.x < start.x && !(start.y == 3 && end.x == 0))
  )
    return getHorizontalMoves(start, end) + getVerticalMoves(start, end) + 'A';

  // otherwise do vertical moves first
  return getVerticalMoves(start, end) + getHorizontalMoves(start, end) + 'A';
}

/**************** ARROW PAD *********************/

// get location of given input on the arrow pad
// (0,0) will never be used
function getArrowLocation(c) {
  // can't compute, so just use switch
  switch (c) {
    case '^':
      return new vec(1, 0);
    case '>':
      return new vec(2, 1);
    case 'v':
      return new vec(1, 1);
    case '<':
      return new vec(0, 1);
    default: // A
      return new vec(2, 0);
  }
}

// get the moves to get from start to end on the arrow pad
// (0,0) cannot be traversed and will never be given as input
// because of arrow layout, want to end on either up or right
function getArrowMoves(start, end) {
  // want to do horizontal first if: moving left or starting in lower left
  if (start.x == 0 || end.x < start.x)
    return getHorizontalMoves(start, end) + getVerticalMoves(start, end) + 'A';

  // otherwise do vertical first
  return getVerticalMoves(start, end) + getHorizontalMoves(start, end) + 'A';
}

// return a string with the vertical moves needed
function getVerticalMoves(start, end) {
  // return corresponding move character depending on direction of move

  // moving down
  if (start.y > end.y) {
    return '^'.repeat(start.y - end.y);
  }

  // if end.y == start.y, repeat 0 gives empty string
  return 'v'.repeat(end.y - start.y);
}

function getHorizontalMoves(start, end) {
  if (start.x > end.x) return '<'.repeat(start.x - end.x);

  // if both have same x, repeat(0) gives empty string
  return '>'.repeat(end.x - start.x);
}
