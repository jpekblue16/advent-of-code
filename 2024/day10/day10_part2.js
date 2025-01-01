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

// perform a breadth first search from the given node
function getScore(x_in, y_in) {
  // use a queue to track spaces to visit
  var queue = [];
  queue.push({ x: x_in, y: y_in });

  // rating will be the most amount of paths being explored at the same time
  var endsReached = 0;

  while (queue.length > 0) {
    var curCoords = queue.shift();

    // whenever a 9 is found, add to the counter
    if (map[curCoords.x][curCoords.y].value == 9) endsReached++;

    // get all adjacent spaces according to path traversal rules
    var adjacent = getAdjacent(curCoords);

    // add each adjacent to the queue
    queue.push(...adjacent);
  }

  return endsReached;
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
