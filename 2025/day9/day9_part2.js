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
  var prev = points[points.length - 2];
  for (var i = Math.min(prev.y, p.y); i <= Math.max(prev.y, p.y); ++i) {
    // check against range for that row

    // if not in map, add with both min/max as p.x
    if (!rowRanges.has(i)) {
      rowRanges.set(i, {
        min: Math.min(p.x, prev.x),
        max: Math.max(p.x, prev.x),
      });
    }
    // if row is already in map, check min and max against p
    else {
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

file.on('close', () => {
  var maxArea = 0;

  console.log(maxArea);
});
