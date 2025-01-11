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
    try {
      return new vec(this.x + addVec.x, this.y + addVec.y);
    } catch (e) {
      throw e;
    }
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
    var lineArray = line.split('');
    var row = [];
    for (var v of lineArray) {
      switch (v) {
        case '@':
          start = new vec(row.length, lineCount);
        case '.':
          row.push(v, '.');
          break;
        case 'O':
          row.push('[', ']');
          break;
        case '#':
          row.push('#', '#');
          break;
        default:
          throw 'BAD INPUT';
      }
    }
    map.push(row);
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
  for (var row = 0; row < map.length; ++row) {
    for (var col = 0; col < map[row].length; ++col) {
      if (map[row][col] == '[') {
        // check which end is closer to the wall and add distance
        total += 100 * row + col;
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
  var spacesToPush = [];

  // breadth first search in the direction to find all spaces to move
  // track which spaces have been added already
  var searchMap = createSearchMap();
  addToQueue(pos, searchQueue, searchMap);

  while (searchQueue.length > 0) {
    var cur = searchQueue.shift();
    // add the space to the push group
    spacesToPush.push(cur);

    // check the next value
    var next = cur.add(searchVector);
    switch (getMapValue(next)) {
      // if [ or ], add space plus adjacent
      case '[':
      case ']':
        // if the space hasn't already been added, add it
        if (!visited(next, searchMap)) {
          addToQueue(next, searchQueue, searchMap);
          // if moving N or S, add corresponding bracket
          if (dir == '^' || dir == 'v') {
            var corresponding =
              getMapValue(next) == '['
                ? new vec(next.x + 1, next.y)
                : new vec(next.x - 1, next.y);
            addToQueue(corresponding, searchQueue, searchMap);
          }
        }
        break;

      // if #, can't move, return position
      case '#':
        return pos;

      // if ., no action
      case '.':
        break;
      default:
        throw 'BAD MAP SYMBOL';
    }
  }

  return doMove(spacesToPush, searchVector);
}

// toPush - array of spaces to move in the given direction
// dir - vector for the direction to move the given spaces in
function doMove(toPush, dir) {
  // loop over all spaces in the array - first element will be the robot
  // move furthest spaces first
  for (var i = toPush.length - 1; i >= 0; --i) {
    // assign the space's value to the next in the direction
    // set space to . - let next moving space assign again if needed
    var s = toPush[i];
    setMap(s.add(dir), getMapValue(s));
    setMap(s, '.');
  }

  return toPush[0].add(dir);
}

function createSearchMap() {
  return new Array(map.length)
    .fill()
    .map(() => new Array(map[0].length).fill().map(() => false));
}

function visited(point, grid) {
  return grid[point.y][point.x];
}

// add the point to the queue and set grid point to true
function addToQueue(point, queue, grid) {
  queue.push(point);
  grid[point.y][point.x] = true;
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
  try {
    return map[pos.y][pos.x];
  } catch (e) {
    throw e;
  }
}
