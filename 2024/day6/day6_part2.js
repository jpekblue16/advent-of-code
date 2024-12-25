// read in boolean grid, note position of obstacles and guard
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day6_input.txt'),
  output: process.stdout,
  terminal: false,
});

/*
  find all points where placing an obstacle creates a loop

  as you follow the path, check if placing an obstacle in front of the guard creates a loop
*/

// holds map of floor, empty spaces will be boolean, obstacles/guard will still be symbols
var grid = [];
var startPos = { x: 0, y: 0 }; // tracks guard starting location

var directions = ['n', 'e', 's', 'w'];

var lineCount = 0; // will be used as y coordinate of grid

file.on('line', (line) => {
  // map line to grid, replace . with false
  var mapLine = Array.from(line.split(''), (v, i) => {
    switch (v) {
      case '^': // found starting pos, store it and put in map
        startPos = { x: i, y: lineCount };
        return { actual: new Set(['n']), test: new Set() }; // store space as visited, going north
      case '#': // put obstacle in map
        return v;
      default: // '.'
        return { actual: new Set(), test: new Set() }; // store a boolean if the space has been visited, and an array of which direction it was visited in
    }
  });

  // add line to grid
  grid.push(mapLine);
  lineCount++;
});

// follow guard's path, marking newly seen empty spaces
file.on('close', () => {
  var total = 0; // tracks number of obstacles that cause a loop

  // track path until guard reaches edge of map
  var facing = 'n'; // guard starts facing north
  var curPoint = { x: startPos.x, y: startPos.y };
  var curSpace = getSpace(curPoint);

  // maintain same pathing as part 1, check for loops created along the path
  while (1) {
    var targetPoint = getNext(curPoint, facing);

    // check if target is outside map
    if (isOutsideMap(targetPoint)) break;

    // check the target point
    // if obstacle, turn
    var targetSpace = getSpace(targetPoint);

    if (targetSpace === '#') {
      // obstacle
      facing = getNextDir(facing); // get next direction
      curSpace.actual.add(facing); // 'visit' current space in new direction
      continue;
    }

    // check if placing an obstacle at target causes a loop
    // don't test position if already traveled
    if (targetSpace.actual.size == 0) {
      var holdTarget = targetSpace;
      grid[targetPoint.y][targetPoint.x] = '#';
      if (causesLoop(curPoint, facing)) total++;
      grid[targetPoint.y][targetPoint.x] = holdTarget;
    }

    // move to the target
    curPoint = targetPoint;
    curSpace = getSpace(curPoint);

    curSpace.actual.add(facing);
  }

  console.log(total);
});

// returns the space at the given position
function getSpace(pos) {
    return grid[pos.y][pos.x];
}

function getNext(point, facing) {
  switch (facing) {
    case 'n':
      return { x: point.x, y: point.y - 1 };
    case 'e':
      return { x: point.x + 1, y: point.y };
    case 's':
      return { x: point.x, y: point.y + 1 };
    case 'w':
      return { x: point.x - 1, y: point.y };
    default:
      throw 'BAD';
  }
}

function isOutsideMap(point) {
  return (
    point.x < 0 ||
    point.x >= grid.length ||
    point.y < 0 ||
    point.y >= grid.length
  );
}

function getNextDir(dir) {
  return directions[(directions.indexOf(dir) + 1) % directions.length];
}

// has the point at the given position been visited?
// pos should be object with x and y: { x:xpos, y:ypos }
function visitedInDirection(pos, dir) {
  try {
    return grid[pos.y][pos.x].test.has(dir);
  } catch (e) {
    console.log(e);
  }
}

function resetTestGrid() {
  // set all spaces according to the "actual" state
  grid.map((v, i) => {
    v.map((v1, i1) => {
      if (v1 !== '#') {
        v1.test = new Set(v1.actual);
      }
    });
  });
}

// returns true if exploring the grid from the given point causes a loop
function causesLoop(start, dir) {
  resetTestGrid(); // start from path actually traveled so far

  var curPoint = start;
  var curSpace = getSpace(curPoint);
  var facing = dir;
  while (1) {
    // proceed around the grid normally

    var targetPoint = getNext(curPoint, facing);

    if (isOutsideMap(targetPoint)) break;

    if (getSpace(targetPoint) === '#') {
      // obstacle hit, turn
      facing = getNextDir(facing);
      if (visitedInDirection(curPoint, facing)) return true;
      curSpace.test.add(facing);
      continue;
    }

    // check if target point has already been traveled in the current direction
    if (visitedInDirection(targetPoint, facing)) {
      return true;
    }

    // move to next space
    curPoint = targetPoint;
    curSpace = getSpace(curPoint);
    curSpace.test.add(facing);
  }

  // guard reaches edge of map, no loop
  return false;
}
