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

  as you follow the path, check if parallel to any already found obstacles in the next direction
    if you have visited the space directly in front of that obstacle
      going the same direction as the next direction
        a loop is created
*/

// holds map of floor, empty spaces will be boolean, obstacles/guard will still be symbols
var grid = [];
var start = { x: 0, y: 0 }; // tracks guard starting location

var directions = ['n', 'e', 's', 'w'];

var lineCount = 0; // will be used as y coordinate of grid

file.on('line', (line) => {
  // map line to grid, replace . with false
  var mapLine = Array.from(line.split(''), (v, i) => {
    switch (v) {
      case '^': // found starting pos, store it and put in map
        start = { x: i, y: lineCount };
        return { going: new Set(['n']) }; // store space as visited, going north
      case '#': // put obstacle in map
        return v;
      default: // '.'
        return { going: new Set() }; // store a boolean if the space has been visited, and an array of which direction it was visited in
    }
  });

  // add line to grid
  grid.push(mapLine);
  lineCount++;
});

// follow guard's path, marking newly seen empty spaces
file.on('close', () => {
  var total = 0; // total spaces visited, including start location

  // track path until guard reaches edge of map
  var facing = 'n'; // guard starts facing north
  var curPoint = { x: start.x, y: start.y };
  var curSpace = getSpace(curPoint);

  // maintain same pathing as part 1, check for loops created along the path
  while (1) {
    var targetPoint = getNext(curPoint, facing);

    // check if target is outside map
    if (isOutsideMap(targetPoint, grid[0].length - 1, grid.length - 1)) break;

    // check the target point
    // if obstacle, turn
    var targetSpace = getSpace(targetPoint);

    if (targetSpace === '#') {
      // obstacle
      facing = getNextDir(facing); // get next direction
      curSpace.going.add(facing); // 'visit' current space in new direction
      continue;
    }

    // move to the target
    curPoint = targetPoint;
    curSpace = getSpace(curPoint);

    curSpace.visited = true;
    curSpace.going.add(facing);

    // simulate placing an obstacle
    // search along the grid in the next direction until
    // an edge, obstacle, or already-visited space is found
    var next = getNextDir(facing);
    var nextPoint = getNext(curPoint, next);
    while (!isOutsideMap(nextPoint) && getSpace(nextPoint) != '#') {
      // if visited that space in the next direction, loop found
      if (visitedInDirection(nextPoint, next)) {
        total++;
        console.log(`loop ${total} found`);
        break;
      }

      // use same "next" direction to keep searching the same direction
      nextPoint = getNext(nextPoint, next);
    }
  }

  console.log(total);
});

// returns the space at the given position
function getSpace(pos) {
  try {
    return grid[pos.y][pos.x];
  } catch (e) {
    console.log(e);
  }
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
    return grid[pos.y][pos.x].going.has(dir);
  } catch (e) {
    console.log(e);
  }
}
