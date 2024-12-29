const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day8_input.txt'),
  output: process.stdout,
  terminal: false,
});

// find 'antinodes, points opposite of two points with same frequency eg
/* #'s are the antinodes, other symbols are antennas, different letter/digit indicates separate 'frequencies'
..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
*/

/*
  (1,2) and (2,4)

  deltaX = 1, deltaY = 2

  antinodes are (0,0) and (3,6)

  a.x - deltaX
*/

var antennaMap = new Map();
var antinodesFound = new Set();

var lineCount = 0; // grid is square, can use lineCount as max for both x and y axes

file.on('line', (line) => {
  var lineArray = line.split('');

  // populate map of each antenna, separated by frequency
  // x is row, y is columm for ease of access
  for (var i in lineArray) {
    if (lineArray[i] != '.') {
      antennaMap.has(lineArray[i])
        ? antennaMap.get(lineArray[i]).push({ x: lineCount, y: parseInt(i) })
        : antennaMap.set(lineArray[i], [{ x: lineCount, y: parseInt(i) }]);
    }
  }

  lineCount++;
});

file.on('close', () => {
  var total = 0;

  // for each frequency, check all pairs to find antinodes
  for (var antennae of antennaMap.values()) {
    // if only 1 antenna, no antinode can be found
    if (antennae.length <= 1) continue;

    // nested loop of frequency pairs
    for (var i = 0; i < antennae.length - 1; ++i) {
      for (var j = i + 1; j < antennae.length; ++j) {
        // check x and y differences between each pair and find antinodes

        // returns array of antinodes for the two points
        var antinodes = findAntinodes(antennae[i], antennae[j]);

        // make sure antinodes are within bounds and unique
        // (shouldn't be any nodes outside the grid for part 2)
        for (var n of antinodes) {
          if (isInsideGrid(n) && !alreadyFound(n)) {
            total++;
            antinodesFound.add(n);
          }
        }
      }
    }
  }

  console.log(total);
});

// a and b are objects containing members x and y indicating point in the input grid
// a will always be same or lower x value
// returns an array of the two antinode points
function findAntinodes(a, b) {
  // find x and y deltas
  var deltaX = b.x - a.x;
  var deltaY = b.y - a.y;

  var result = [];

  // find furthest point along line created by points
  // loop backwards using deltas until the next point would go off grid
  var startPoint = { x: a.x, y: a.y };
  while (isInsideGrid({ x: startPoint.x - deltaX, y: startPoint.y - deltaY })) {
    startPoint.x -= deltaX;
    startPoint.y -= deltaY;
  }

  // loop forwards using deltas until you reach a point off the grid again
  while (isInsideGrid(startPoint)) {
    result.push({ x: startPoint.x, y: startPoint.y });
    startPoint.x += deltaX;
    startPoint.y += deltaY;
  }

  return result;
}

// point is an object containing members x and y
// returns t/f based on if the coordinates are within the grid
function isInsideGrid(point) {
  return (
    point.x >= 0 && point.x < lineCount && point.y >= 0 && point.y < lineCount
  );
}

// returns true if the point is already in the antinode set
function alreadyFound(a) {
  for (var n of antinodesFound.values()) {
    if (n.x == a.x && n.y == a.y) return true;
  }
}
