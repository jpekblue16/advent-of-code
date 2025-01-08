const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day15_input.txt'),
  output: process.stdout,
  terminal: false,
});

// create class for easy grid traversal
class vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(addVec) {
    return new vec(this.x + addVec.x, this.y + addVec.y);
  }

  neg() {
    return new vec(-this.x, -this.y);
  }
}

// read in input in 2 stages
// read in map until blank line is found
// then read in all moves
var map = [];
var start = {};

var moves = [];
var readMap = true;
var lineCount = 0;
file.on('line', (line) => {
  // blank line found, switch to read in moves
  if (line == '') {
    readMap = false;
    return;
  }

  // read in next line of map
  if (readMap) {
    map.push(
      Array.from(line.split(''), (v, i) => {
        if (v == '@') start = { x: i, y: lineCount };
        return v;
      })
    );
  } else {
    moves.push(...line.split(''));
  }

  lineCount++;
});

file.on('close', () => {
  // process moves, moving robot and boxes as described by rules
  var botPos = new vec(start.x, start.y);
  for (var m of moves) {
    botPos = move(botPos, m);
  }
  // calculate total based on box positions
  var total = 0;
  for (var row in map) {
    for (var col in map[row]) {
      if (map[row][col] == 'O') {
        total += 100 * parseInt(row) + parseInt(col);
      }
    }
  }
  console.log(total);
});

// pos is the current position of the robot, dir is the direction to move in
function move(pos, dir) {
  // move the bot in the given direction, pushing any boxes found along the way
  // if wall is found, no push and robot doesn't move
  var searchVector = getSearchVector(dir);

  // store array of blocks to push in the direction
  var pushBlock = [new vec(pos.x, pos.y)];

  // check along the search direction until a wall or empty space is found
  var next = pos.add(searchVector);
  while (getMapValue(next) == 'O') {
    pushBlock.push(next);
    next = next.add(searchVector);
  }

  // if an empty space to move to is found, only need to move the bot and last box
  if (getMapValue(next) == '.') pos = doMove(pushBlock, searchVector);

  return pos;
}

// given start and end of row/col of bot and boxes to push
// start - set to . and set next to @
// end - set next space to end
function doMove(toPush, dir) {
  // set next of end to end
  // set end to prev
  // set next of start to start
  // set start to .

  // if more than one space to push, move end
  if (toPush.length > 1) {
    var end = toPush.at(-1);
    setMap(end.add(dir), getMapValue(end));
    setMap(end, getMapValue(end.add(dir.neg())));
  }

  // move start
  var start = toPush.at(0);
  setMap(start.add(dir), getMapValue(start)); // should be @
  setMap(start, '.'); // should be .

  return start.add(dir);
}

function getSearchVector(dir) {
  switch (dir) {
    case '^':
      return new vec(0, -1);
    case '>':
      return new vec(1, 0);
    case 'v':
      return new vec(0, 1);
    case '<':
      return new vec(-1, 0);
    default:
      throw 'BAD';
  }
}

function setMap(pos, value) {
  map[pos.y][pos.x] = value;
}

// returns the map character at the given pos vector
function getMapValue(pos) {
  return map[pos.y][pos.x];
}
