const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

var points = [];
var maxX, maxY;

file.on('line', (line) => {
  var coord = line.split(',').map((v) => Number(v));

  points.push(coord);
});

// calculates the area of the rectangle created by the two points as opposite corners
function getArea(a, b) {
  var xLength = Math.abs(a[0] - b[0]) + 1;
  var yLength = Math.abs(a[1] - b[1]) + 1;

  return xLength * yLength;
}

file.on('close', () => {
  var maxArea = 0;
  // loop over list of points
  for (var i = 0; i < points.length; ++i) {
    // check against each other point and calculate area of rectangle
    for (var j = i + 1; j < points.length; ++j) {
      // calculate area
      var area = getArea(points[i], points[j]);

      if (area > maxArea) maxArea = area;
    }
  }

  console.log(maxArea);
});
