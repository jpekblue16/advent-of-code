

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day4_input.txt'),
    output: process.stdout,
    terminal: false
});

// grid will be square
var grid = new Array();

// read input into matrix
file.on('line', (line) => {
  grid.push(Array.from(line.split('')));
});

file.on('close', () => {
  console.log(grid);

  console.log(getXmasCount(grid));
});

// process matrix
function getXmasCount(grid) {

  var total = 0;

  // start at 1,1, cross cant be found on border
  for (var y = 1; y < grid.length - 1; ++y) {
    for (var x = 1; x < grid.length - 1; ++x) {

      // console.log(grid[row][col]);

      // if A is found, check for M S opposite each other along diagonals
      if (grid[y][x] == 'A') {

        // check if there is a MAS cross at the point
        if (isCross(x,y)) total++;
        
      }
    }
  }

  return total;
}

// probably a cleaner way to do this but meh
function isCross(x,y) {
  
  var ul_dr = ""+grid[y-1][x-1]+grid[y+1][x+1];
  if (ul_dr != "MS" && ul_dr != "SM") return false;

  var ur_dl = ""+grid[y-1][x+1]+grid[y+1][x-1];
  if (ur_dl != "MS" && ur_dl != "SM") return false;

  return true;
}