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

    need to figure out how to include points like A and exclude points like B
    points like C are especially tricky

  observations of input:
    there are only 2 points given for a particular row or column
    point p will have x and y values that are in the same row as a given point
    one of the other corners must also be a given point
    lowest X or Y value is ~3000 ie not close to edge
*/

// track minimum and maximum bounds at a given row/column?

// track list of points
var points = [];

// track min and max values for each row
var rowRanges = new Map();

file.on('line', (line) => {
  // read in list of points (corners of shape)
  var coord = line.split(',').map((v) => Number(v));
  var p = { x: coord[0], y: coord[1] };
  points.push(p);

  // set min and max ranges for all rows between this point and previous point
  // if y values are equal, only that row will be checked
  var prev = points.length > 1 ? points[points.length - 2] : p;
  for (var i = Math.min(prev.y, p.y); i <= Math.max(prev.y, p.y); ++i) {
    // check against range for that row
    var minX = Math.min(p.x, prev.x);
    var maxX = Math.max(p.x, prev.x);

    // if not in map, add with both min/max as p.x
    if (!rowRanges.has(i)) {
      rowRanges.set(i, {
        min: minX,
        max: maxX,
      });
    }
    // if row is already in map, check min and max against p
    else {
      var range = rowRanges.get(i);

      range.min = Math.min(minX, range.min);
      range.max = Math.max(maxX, range.max);
    }
  }
});

// determines if point p is within the shape - see comment block above
function withinShape(p) {
  if (rowRanges.has(p.y)) {
    var range = rowRanges.get(p.y);
    return range.min <= p.x && p.x <= range.max;
  }

  return false;
}

function getArea(a, b) {
  var xLength = Math.abs(a.x - b.x) + 1;
  var yLength = Math.abs(a.y - b.y) + 1;

  return xLength * yLength;
}

file.on('close', () => {
  var maxArea = 0;

  // connect wrap around edge
  var last = points[points.length - 1];
  var first = points[0];
  for (var i = Math.min(first.y, last.y); i <= Math.max(first.y, last.y); ++i) {
    // all rows will be within map
    var range = rowRanges.get(i);
    if (Math.min(first.x, last.x) < range.min)
      range.min = Math.min(first.x, last.x);
    if (Math.max(first.x, last.x) > range.max)
      range.max = Math.max(first.x, last.x);
  }

  // loop over all points
  for (var i = 0; i < points.length - 1; ++i) {
    // check recrangle made by using each other point as the diagonal corner
    for (var j = i + 1; j < points.length; ++j) {
      // get all corners of the rectangle
      var pointA = points[i];
      var pointB = points[j];

      // (when comparing adjacent points, other corners should be the same as A and B)
      var otherCornerA = { x: pointA.x, y: pointB.y };
      var otherCornerB = { x: pointB.x, y: pointA.y };

      // if both other corners are within the shape, check area
      if (withinShape(otherCornerA) && withinShape(otherCornerB)) {
        // check if area is greater than max
        maxArea = Math.max(maxArea, getArea(pointA, pointB));
      }
    }
  }

  console.log(maxArea);
});
