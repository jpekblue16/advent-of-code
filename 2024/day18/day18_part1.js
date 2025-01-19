const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day18_test.txt'),
  output: process.stdout,
  terminal: false,
});

var GRID_SIZE = 7;

var BLOCK_COUNT = 1024;

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

class cell {
  // Row and Column index of its parent
  // Note that 0 <= i <= ROW-1 & 0 <= j <= COL-1
  constructor() {
    this.parent_i = -1;
    this.parent_j = -1;
    this.f = Infinity;
    this.g = Infinity;
    this.h = Infinity;
  }
}

// read in locations of first BLOCK_COUNT blocks
var blocksRead = 0;
var blockGrid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill(1));
file.on('line', (line) => {
  // only read first designated amount of blocks
  if (blocksRead >= BLOCK_COUNT) return;

  var point = Array.from(line.split(','), (v) => parseInt(v));
  // set grid block
  blockGrid[point[1]][point[0]] = 0;
});

file.on('close', () => {
  // create the grid, setting blocks at each point
  var grid = initGrid();

  // a* search proritize S and E moves
  var start = new vec(0, 0);
  var end = new vec(GRID_SIZE - 1, GRID_SIZE - 1);

  var cost = doAStar(start, end);

  console.log(cost);
});

function doAStar(start, end) {
  // create closed list
  var closedList = new Array(GRID_SIZE)
    .fill()
    .map(() => new Array(GRID_SIZE).fill(false));

  var detailGrid = new Array(GRID_SIZE)
    .fill()
    .map(() => new Array().fill(new cell()));
}

// return the grid value of the point
function getGridNode(p) {
  return grid[p.y][p.x];
}

// determine if the point is inside the grid
function isInsideGrid(p) {
  return p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE;
}
