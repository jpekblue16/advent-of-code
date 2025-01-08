const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day14_input.txt'),
  output: process.stdout,
  terminal: false,
});

// simulate robots after 100 steps
const WIDTH = 101,
  HEIGHT = 103;

var robots = [];

// line is "p=x,y v=x,y"
// x and y are numbers, possibly negative
var numRegex = /-?[0-9]+/g;
file.on('line', (line) => {
  // read in robot
  var [px, py, vx, vy] = Array.from(line.matchAll(numRegex), (v) =>
    parseInt(v[0])
  );

  robots.push({
    position: { x: px, y: py },
    velocity: { dx: vx, dy: vy },
  });
});

file.on('close', () => {
  // check for tree, then perform one step if not found
  var steps = 0;
  while (!treeFound()) {
    // perform one step for each robot
    advanceBots();
    steps++;
  }
  console.log(steps);
});

// returns true if a tree shape is found
// assume 3/4 of bots in contiguous block means tree is found
const TREE_RATIO = 0.75;
function treeFound() {
  // create grid of robots
  // true at position if at least one bot is there, false if no bots
  // also note if visited or not for search
  var grid = createGrid();

  // find largest contiguous group of bots
  for (var i = 0; i < HEIGHT; ++i) {
    for (var j = 0; j < WIDTH; ++j) {
      var cur = grid[i][j];
      if (!cur.visited && cur.isBot) {
        var blockSize = findBlock(j, i, grid);

        // if block size is over the threshold, tree found
        if (blockSize >= robots.length * TREE_RATIO) {
          printGrid(grid);
          return true;
        }

        // also look for 3x3 grid of bots, count that as tree
        if (isSurrounded(j, i, grid)) {
          printGrid(grid);
          return true;
        }
      }
    }
  }

  return false;
}

function advanceBots() {
  for (var bot of robots) {
    bot.position.x = nextPos(bot.position.x, bot.velocity.dx, WIDTH);
    bot.position.y = nextPos(bot.position.y, bot.velocity.dy, HEIGHT);
  }
}

function nextPos(p, v, max) {
  // apply rate to value
  // need to account for negative result by adding an additional max
  return (((p + v) % max) + max) % max;
}

function createGrid() {
  var grid = new Array(HEIGHT)
    .fill()
    .map(() =>
      new Array(WIDTH).fill().map(() => ({ visited: false, isBot: false }))
    );

  // add each robot to the grid
  for (var bot of robots) {
    grid[bot.position.y][bot.position.x].isBot = true;
  }

  return grid;
}

function findBlock(startX, startY, grid) {
  return 0;
}

function isSurrounded(x, y, grid) {
  // check if the given position is surrounded by bots
  // points on an edge cannot be surrounded
  if (x == 0 || x == WIDTH - 1 || y == 0 || y == HEIGHT - 1) return false;

  // make an array of all adjacent spaces
  var adjacent = getAdjacent(x, y);

  // if any adjacent point does not have a bot, return false
  try {
    for (var point of adjacent) {
      if (!grid[point.y][point.x].isBot) return false;
    }
  } catch (e) {
    throw e;
  }
  return true;
}

// returns an array of all 8 surrounding positions
function getAdjacent(x_in, y_in) {
  return [
    { x: x_in - 1, y: y_in - 1 },
    { x: x_in, y: y_in - 1 },
    { x: x_in + 1, y: y_in - 1 },
    { x: x_in - 1, y: y_in },
    { x: x_in + 1, y: y_in },
    { x: x_in - 1, y: y_in + 1 },
    { x: x_in, y: y_in + 1 },
    { x: x_in + 1, y: y_in + 1 },
  ];
}

// grid is 2d matrix, will print X if bot is on space, . if not
function printGrid(grid) {
  for (var row of grid) {
    var rowString = '';
    for (var col of row) {
      rowString += col.isBot ? 'X' : '.';
    }
    console.log(rowString);
  }
}
