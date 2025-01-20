const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day18_input.txt'),
  output: process.stdout,
  terminal: false,
});

var GRID_SIZE = 71;

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

  isEqual(otherVec) {
    return this.x == otherVec.x && this.y == otherVec.y;
  }
}

// read in locations of first BLOCK_COUNT blocks
var blocksRead = 0;
var blocks = new Set();
var extraBlocks = [];
file.on('line', (line) => {
  // only read first designated amount of blocks
  if (blocksRead >= BLOCK_COUNT) extraBlocks.push(line);
  else blocks.add(line);

  blocksRead++;
});

var grid;

file.on('close', () => {
  // a* search, proritize S and E moves
  var start = new vec(0, 0);
  var end = new vec(GRID_SIZE - 1, GRID_SIZE - 1);

  var shortestPath = findShortestPath(start, end);

  for (var b of extraBlocks) {
    var block_p = new vec(...b.split(',').map((v) => parseInt(v)));

    // add the block to the grid
    blocks.add(b);

    // if the block lies on the current shortest path, recalculate
    if (shortestPath.has(getGridCell(block_p).id)) {
      // get path after adding block
      shortestPath = findShortestPath(start, end);
      if (shortestPath.size <= 1) {
        console.log(b);
        return;
      }
    }
  }
});

// finds the shortest path from start to end, navigating around blocks

function findShortestPath(start, end) {
  // create grid
  // each point has
  // - id for tracking cost to reach
  // - steps taken to reach point
  // - blocked or open
  initGrid();

  // track path backwards
  // key = node id, value = its previous id
  var path = new Map();

  // do breadth first search
  var searchQueue = [start];
  getGridCell(start).steps = 0;
  var curStep = 0;
  while (searchQueue.length > 0) {
    // take the next point in the queue
    var cur = searchQueue.shift();
    var curCell = getGridCell(cur);

    // if steps > curstep, on next step (should only ever increment by 1)
    if (curCell.steps > curStep) curStep = curCell.steps;

    // add cur to path
    path.set(curCell.id, curCell.prev);

    // check neighboring open cells
    var adjacent = getAllNext(cur);
    for (var next of adjacent) {
      var nextCell = getGridCell(next);
      //   if destination return curstep+1
      if (next.isEqual(end)) {
        path.set(nextCell.id, curCell.id);
        break;
      }
      //   else if curstep+1 < next.steps add to search queue with steps = curStep+1
      else if (curStep + 1 < nextCell.steps) {
        nextCell.steps = curStep + 1;
        nextCell.prev = curCell.id;
        searchQueue.push(next);
      }
    }
  }

  var pathSet = new Set();
  var p = getGridCell(end).id;
  while (p >= 0) {
    pathSet.add(p);
    p = path.get(p);
  }
  // end not found (end is guaranteed to be found)
  return pathSet;
}

class gridCell {
  constructor(id_in) {
    this.id = id_in;
    this.steps = Infinity;
    this.blocked = false;
    this.prev = -1;
  }
}

// initialize the traversal grid
function initGrid() {
  var newGrid = new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE));

  var idCounter = 0;
  for (var row in newGrid) {
    for (var col = 0; col < GRID_SIZE; ++col) {
      newGrid[row][col] = new gridCell(idCounter++);
      if (blocks.has(`${col},${row}`)) newGrid[row][col].blocked = true;
    }
  }

  grid = newGrid;
}

// return the grid cell at the given point
function getGridCell(p) {
  return grid[p.y][p.x];
}

// find all points adjacent to the given point that are traversable
const DIRECTIONS = ['e', 's', 'w', 'n'];
function getAllNext(p) {
  // check each direction, if valid, add to result
  var result = [];
  for (var dir of DIRECTIONS) {
    var next = getNext(p, dir);

    if (isInsideGrid(next) && !grid[next.y][next.x].blocked) {
      result.push(next);
    }
  }

  return result;
}

// gets the coordinates for the next space in the given direction
function getNext(pos, dir) {
  return pos.add(getDir(dir));
}

// returns the unit vector for the given direction
function getDir(dir) {
  switch (dir) {
    case 'n':
      return new vec(0, -1);
    case 'e':
      return new vec(1, 0);
    case 's':
      return new vec(0, 1);
    case 'w':
      return new vec(-1, 0);
    default:
      throw 'BAD';
  }
}

// determine if the point is inside the grid
function isInsideGrid(p) {
  return p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE;
}
