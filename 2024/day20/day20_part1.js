const { dir } = require('node:console');
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day20_input.txt'),
  output: process.stdout,
  terminal: false,
});

// find path through maze

// then, determine at which points a shortcut through a single wall tile
// can be made to shorten the distance

// find number of points where distance saved >= 100 steps

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

// read in grid
class grid {
  constructor() {
    this.theGrid = new Array();
  }

  addRow(row) {
    this.theGrid.push(row);
  }

  at(vec) {
    return this.theGrid[vec.y][vec.x];
  }

  resetSteps() {
    for (var i = 0; i < this.theGrid.length; ++i) {
      this.theGrid[i].forEach((v) => {
        v.steps = Infinity;
      });
    }
  }
}

class gridCell {
  constructor(id_in, value_in) {
    this.id = id_in;
    this.steps = Infinity;
    this.value = value_in;
  }
}

// read in map and save start and end points
var map = new grid();
var lineCount = 0,
  idCounter = 0;
var start, end;
file.on('line', (line) => {
  if (line.indexOf('S') != -1) start = new vec(line.indexOf('S'), lineCount);
  if (line.indexOf('E') != -1) end = new vec(line.indexOf('E'), lineCount);
  map.addRow(line.split('').map((v) => new gridCell(idCounter++, v)));
  lineCount++;
});

// find initial path, save any wall points that have open space behind them

// track along shortest path, checking for walls with path behind them
// remove wall and find shortest path again
// if diff between original shortest and new shortest > threshold, increment total

const THRESHOLD = 100;
file.on('close', () => {
  // get the baseline length, and array of all wall points with an open space behind it
  var [minLength, thinWalls] = findShortestPath(start, true, Infinity);

  var total = 0;

  // for each wall, disable it and check new shortest length
  for (var w of thinWalls) {
    var wall = new vec(...w.split(',').map((v) => parseInt(v)));
    // disable wall
    map.at(wall).value = '.';

    // find new length
    var newLength = findShortestPath(start, false);

    // console.log(
    //   `removing wall at ${wall.toString()} results in a new length of ${newLength}, ${
    //     minLength - newLength
    //   } step improvement`
    // );

    // re-enable wall
    map.at(wall).value = '#';

    // if minLength - newLength > threshold, increment counter
    if (minLength - newLength >= THRESHOLD) total++;
  }

  console.log(total);
});

// find the shortest path from start to end on the grid
const DIRECTIONS = ['n', 'e', 's', 'w'];
function findShortestPath(start, getWalls) {
  // track locations of any walls with an open space behind them
  var thinWalls = new Set();

  // set up the map for a new search
  map.resetSteps();

  var searchQueue = [start];
  map.at(start).steps = 0;
  var curStep = 0;
  while (searchQueue.length > 0) {
    var cur = searchQueue.shift();
    var curCell = map.at(cur);

    if (curCell.steps > curStep) curStep = curCell.steps;

    // check each direction for adjacency and thin walls
    for (var d of DIRECTIONS) {
      var dirVec = getDir(d);

      var next = cur.add(dirVec);
      var nextCell = map.at(next);

      // if end, done
      if (nextCell.value == 'E') {
        // if getting walls, include in return, otherwise just return steps
        return getWalls ? [curStep + 1, thinWalls] : curStep + 1;
      }
      // if open, add to queue
      if (nextCell.value == '.' && curStep < nextCell.steps) {
        searchQueue.push(next);
        nextCell.steps = curStep + 1;
      }
      // if wall, check tile behind it
      else if (getWalls && nextCell.value == '#') {
        var behind = next.add(dirVec);

        if (
          isInsideMap(behind) &&
          (map.at(behind).value == '.' || map.at(behind).value == 'E')
        ) {
          thinWalls.add(next.toString());
        }
      }
    }
  }
  // path not found - shouldn't reach
  return -1;
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
function isInsideMap(p) {
  return p.x >= 0 && p.x < lineCount && p.y >= 0 && p.y < lineCount;
}
