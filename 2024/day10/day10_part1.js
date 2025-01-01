const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day10_input.txt'),
  output: process.stdout,
  terminal: false,
});

var map = [];
var idCounter = 0;

file.on('line', (line) => {
  map.push(
    Array.from(line, (v) => {
      return { id: idCounter++, value: parseInt(v) };
    })
  );
});

file.on('close', () => {
  var score = 0;

  // read through the map
  for (var i = 0; i < map.length; ++i) {
    for (var j = 0; j < map.length; ++j) {
      var cur = map[i][j];

      if (cur.value == 0) {
        // get the score for that
        score += getScore(i, j);
      }
    }
  }

  console.log(score);
});

// perform a depth first search from the given node
function getScore(x_in, y_in) {
  var endsReached = new Set();

  // use a stack to track spaces to visit
  var stack = [];
  stack.push({ x: x_in, y: y_in });

  while (stack.length > 0) {
    var curCoords = stack.pop();

    var cur = map[curCoords.x][curCoords.y];
    // if the value is 9 and not found yet, add it and return
    if (cur.value == 9 && !endsReached.has(cur.id)) {
      endsReached.add(cur.id);
    }

    // get all adjacent spaces according to path traversal rules
    var adjacent = getAdjacent(curCoords);

    // add each adjacent to the stack
    stack.push(...adjacent);
  }

  return endsReached.size;
}

// returns an array of all adjacent spaces
// always in NESW order

var directions = ['n', 'e', 's', 'w'];

function getAdjacent(coords) {
  var result = [];

  // get the 4 adjacent coordinates
  for (var i in directions) {
    var adj = getDirection(coords, directions[i]);

    // if the coordinates are within the map
    if (isInsideMap(adj)) {
      var test = map[adj.x][adj.y];

      // add to result if value is one higher than current
      // don't need to worry about moving backwards/marking as visited because can only move on increasing spaces
      if (test.value == 1 + map[coords.x][coords.y].value) {
        result.push(adj);
      }
    }
  }

  return result;
}

// returns the coordinates in the given direction
function getDirection(coords, dir) {
  var newX = coords.x,
    newY = coords.y;
  switch (dir) {
    case 'n':
      newX--;
      break;
    case 'e':
      newY++;
      break;
    case 's':
      newX++;
      break;
    case 'w':
      newY--;
      break;
    default:
      throw 'BAD';
  }

  return { x: newX, y: newY };
}

function isInsideMap(point) {
  return (
    point.x >= 0 && point.x < map.length && point.y >= 0 && point.y < map.length
  );
}
