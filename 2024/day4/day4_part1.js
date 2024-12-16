// read input into matrix

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day4_input.txt'),
    output: process.stdout,
    terminal: false
});

const XMAS = 'XMAS';

// grid will be square
var grid = new Array();

file.on('line', (line) => {
  grid.push(Array.from(line.split('')));
});

file.on('close', () => {
  console.log(grid);

  console.log(getXmasCount(grid));
});

/*
  .  .  .
   . . .
    ...
  ...X...
    ...
   . . .
  .  .  .   
*/

/*
const searchDirs = {
  'u': -1,
  'd': 1,
  'l': -1,
  'r': 1
}
*/
// describes vector of search for each direction
const searchDirs = {
  'ul': {x: -1, y: -1}, // (3,3)
  'u' : {x:  0, y: -1}, // (3,0)
  'ur': {x:  1, y: -1}, // (-3,3)
  'l' : {x: -1, y:  0}, // (0,3)
  // center 0 , 0
  'r' : {x:  1, y:  0}, // (0,-3)
  'dl': {x: -1, y:  1}, // (3,-3)
  'd' : {x:  0, y:  1}, // (0,-3)
  'dr': {x:  1, y:  1}  // (-3,-3)
}

// process matrix
function getXmasCount(grid) {

  var total = 0;

  for (var row in grid) {
    for (var col in grid[row]) {

      // console.log(grid[row][col]);

      if (grid[row][col] == 'X') {
        // start of word is found
        var start = {x:parseInt(col),y:parseInt(row)};

        // check all directions for 'XMAS'
        for (var [dir,vector] of Object.entries(searchDirs)) {
          //console.log(`checking direction: ${dir}; vector: <${vector.x},${vector.y}>`);
          if (checkDirection(start,vector)) total++;
        }
        
      }
    }
  }

  return total;
}

function checkDirection(start,dir) {

  // find end point, if outside of grid can skip
  var end = {
    x: start.x + (dir.x * (XMAS.length - 1)),
    y: start.y + (dir.y * (XMAS.length - 1))
  }


  // check for trivial case - not enough room
  if (end.x < 0 || end.x >= grid.length || end.y < 0 || end.y >= grid.length) return false;

  // check for M A S
  for (var i = 1; i < XMAS.length; i++) {
    var test = { x: start.x+(i*dir.x), y: start.y+(i*dir.y) };

    //console.log(`letter at ${test.x},${test.y} is ${grid[test.y][test.x]}; checking against ${XMAS.substring(i,i+1)}`);

    if (grid[test.y][test.x] != XMAS.substring(i,i+1)) {
      return false;
    }
  }

  return true;
}