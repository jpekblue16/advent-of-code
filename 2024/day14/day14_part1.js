const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day14_input.txt'),
  output: process.stdout,
  terminal: false,
});

// simulate robots after 100 steps
const WIDTH = 101,
  HEIGHT = 103;

const STEPS = 100;

var quadrants = [0, 0, 0, 0];

// line is "p=x,y v=x,y"
// x and y are numbers, possibly negative
var numRegex = /-?[0-9]+/g;
file.on('line', (line) => {
  // read in robots
  // [px,py,vx,vy]
  var [px, py, vx, vy] = Array.from(line.matchAll(numRegex), (v) =>
    parseInt(v[0])
  );

  var finalX = (px + STEPS * vx) % WIDTH;
  if (finalX < 0) finalX += WIDTH;

  var finalY = (py + STEPS * vy) % HEIGHT;
  if (finalY < 0) finalY += HEIGHT;

  console.log(`final position is ${finalX},${finalY}`);

  var quadrant = getQuadrant(finalX, finalY);
  if (quadrant >= 0) quadrants[quadrant]++;
});

file.on('close', () => {
  console.log(`${quadrants.reduce((accum, v) => accum * v, 1)}`);
});

// returns the quadrant the point lies in
// upper left = 0, upper right = 1, lower left = 2, lower right = 3
function getQuadrant(x, y) {
  var midWidth = Math.floor(WIDTH / 2);
  var midHeight = Math.floor(HEIGHT / 2);

  if (x < midWidth && y < midHeight) return 0;
  if (x > midWidth && y < midHeight) return 1;
  if (x < midWidth && y > midHeight) return 2;
  if (x > midWidth && y > midHeight) return 3;

  // no quadrant found
  return -1;
}
