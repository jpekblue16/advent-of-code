// read in boolean grid, note position of obstacles and guard
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day6_input.txt'),
  output: process.stdout,
  terminal: false,
});

// holds map of floor, empty spaces will be boolean, obstacles/guard will still be symbols
var grid = [];
var start = { x: 0, y: 0 }; // tracks guard starting location

var directions = ['n', 'e', 's', 'w'];

var lineCount = -1; // will be used as y coordinate of grid

file.on('line', (line) => {
  lineCount++;

  // map line to grid, replace . with false
  var mapLine = Array.from(line.split(''), (v, i) => {
    switch (v) {
      case '^': // found starting pos, store it and put in map
        start = { x: i, y: lineCount };
      case '#': // put obstacle in map
        return v;
      default: // '.'
        return false;
    }
  });

  // add line to grid
  grid.push(mapLine);
});

// follow guard's path, marking newly seen empty spaces
file.on('close', () => {
  var total = 1; // total spaces visited, including start location

  // track path until guard reaches edge of map
  var facing = 'n'; // guard starts facing north
  var curPoint = { x: start.x, y: start.y };

  while (1) {
    var targetPoint = getNext(curPoint, facing);

    // check if target is outside map
    if (isOutsideMap(targetPoint, grid[0].length - 1, grid.length - 1)) break;

    switch (grid[targetPoint.y][targetPoint.x]) {
      case false:
        total++;
        grid[targetPoint.y][targetPoint.x] = true;
        break;
      case '#':
        facing =
          directions[(directions.indexOf(facing) + 1) % directions.length]; // get next direction
        continue;
        break;
      default: // already walked on (including start pos)
        break;
    }

    curPoint = targetPoint;
  }

  console.log(total);
});

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

function isOutsideMap(point, maxX, maxY) {
  return point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY;
}
