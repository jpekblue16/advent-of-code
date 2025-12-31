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

// read in list of points
// points will always form a straight line with prev/next points
// i.e. either x or y coord will be same

var points = [];

file.on('line', (line) => {
  // read in list of points (corners of shape)
  var coord = line.split(',').map((v) => Number(v));
  points.push({ x: coord[0], y: coord[1] });
});

// determines if point p is within the shape - see comment block above
function withinShape(p) {}

file.on('close', () => {
  var maxArea = 0;

  console.log(maxArea);
});
