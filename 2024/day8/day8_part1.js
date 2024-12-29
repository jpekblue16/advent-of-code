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
        : antennaMap.set(
            lineArray[i],
            new Array({ x: lineCount, y: parseInt(i) })
          );
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

        // returns tuple of both antinode coordinates, even if outside the grid
        var antinodes = findAntinodes(antennae[i], antennae[j]);

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

  return [
    { x: a.x - deltaX, y: a.y - deltaY },
    { x: b.x + deltaX, y: b.y + deltaY },
  ];
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
