const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

/* find largest area of rectangle made by 2 points within the input
other corners must be either:
  another point within input
  within shape made by all points connected at corners
  e.g. other corners must be either at a # or X
    ..............
    .......#XXX#..
    .......XXXXX..
    ..#XXXX#XXXX..
    ..XXXXXXXXXX..
    ..#XXXXXX#XX..
    .........XXX..
    .........#X#..
    ..............

    ..............
    ..B....#XXX#..
    .......XXXXX..
    ..#XXXX#XXXA..
    ..XXXXXXXXXX..
    ..#XXX#AXAXX..
    ......XXXXXX..
    ..C...#XX#XX..
    ......B..#X#..
    ..............

  possible?
    ..............
    ...#XXXAXXX#..
    ...XXXXXXXXX..
    ..B#XXX#XXXX..
    .......XXXXX..
    .......XXXXX..
    ..#BXXA#XXXX..
    ..XXXXXXXXXX..
    ..#XXX#AXAXX..
    ......XXXXXX..
    ..C...#XX#XX..
    ......B..#X#..
    ..............

    need to figure out how to include points like A and exclude points like B
    points like C are especially tricky

  observations of input:
    there are only 2 points given for a particular row or column
    point p will have x and y values that are in the same row as a given point
    one of the other corners must also be a given point
    lowest X or Y value is ~3000 ie not close to edge

    hypothesis:
      a given point p is within the shape if:
        it is given within the input or;
        it is between two given points;
        there is are points i given in the input for each of these:
          i.x > p.x && i.y > p.y
          i.x > p.x && i.y < p.y
          i.x < p.x && i.y > p.y
          i.x < p.x && i.y < p.y
*/
var rowMap = new Map(); // y coordinate
var colMap = new Map(); // x coordinate

var points = [];
var maxX = 0,
  maxY = 0; // track max X and Y values
minX = Number.MAX_SAFE_INTEGER;
minY = Number.MAX_SAFE_INTEGER;

file.on('line', (line) => {
  var coord = line.split(',').map((v) => Number(v));

  rowMap.has(coord[1])
    ? rowMap.get(coord[1]).push(coord[0])
    : rowMap.set(coord[1], [coord[0]]);

  colMap.has(coord[0])
    ? colMap.get(coord[0]).push(coord[1])
    : colMap.set(coord[0], [coord[1]]);

  points.push({ x: coord[0], y: coord[1] });

  maxX = Math.max(coord[0], maxX);
  maxY = Math.max(coord[1], maxY);
  minX = Math.min(coord[0], minX);
  minY = Math.min(coord[1], minY);
});

// calculates the area of the rectangle created by the two points as opposite corners
function getArea(a, b) {
  var xLength = Math.abs(a[0] - b[0]) + 1;
  var yLength = Math.abs(a[1] - b[1]) + 1;

  return xLength * yLength;
}

// determines if point p is within the shape - see comment block above
function withinShape(p) {
  // check for point being directly between 2 given points
  // if colMap has p.x or rowMap has p.y, check that other value is between the range in the map

  // check if point is between points vertically
  if (colMap.has(p.x)) {
    var range = colMap.get(p.x);
    // if the y value is between the two points (inclusive), it is within the shape
    // don't know which y value is higher/lower
    return (
      (range[0] <= p.y && range[1] >= p.y) ||
      (range[1] <= p.y && range[0] >= p.y)
    );
  }

  // check if point is between points horizontally
  if (rowMap.has(p.y)) {
    var range = rowMap.get(p.y);

    return (
      (range[0] <= p.x && range[1] >= p.x) ||
      (range[1] <= p.x && range[0] >= p.x)
    );
  }

  // check for internal point - ???

  return within;
}

file.on('close', () => {
  var maxArea = 0;
  // loop over list of points
  for (var i = 0; i < points.length; ++i) {
    // check against each other point
    for (var j = i + 1; j < points.length; ++j) {
      // exclude in-line points, assume area will not be one dimensional
      if (points[i].x == points[j].x || points[i].y == points[j].y) continue;

      // check that other corners are within shape
      var otherCorners = [
        { x: points[i].x, y: points[j].y },
        { x: points[j].x, y: points[i].y },
      ];

      // if both other corners are within the shape, check area
      // MAYBE: check if one of the corners is a given point
      if (withinShape(otherCorners[0]) && withinShape[otherCorners[1]]) {
        var area = getArea(points[i], points[j]);
        if (area > maxArea) maxArea = area;
      }
    }
  }

  console.log(maxArea);
});
