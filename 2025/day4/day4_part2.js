const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day4_test.txt' : 'day4_input.txt'),
  output: process.stdout,
  terminal: false,
});

var grid = [];

// find number of paper rolls (@) with <4 other paper rolls in 8 adjacent squares

// check if there are fewer than 4 other rolls in the surrounding squares of the given coordinate
function canBeRemoved(x, y) {
  // check for top row
  var top = x == 0,
    bottom = x == grid.length - 1,
    left = y == 0,
    right = y == grid.length - 1;

  var count = 0;

  // row above
  if (!top) {
    if (!left && grid[x - 1][y - 1] == '@') count++;
    if (grid[x - 1][y] == '@') count++;
    if (!right && grid[x - 1][y + 1] == '@') count++;
  }

  // same row
  if (!left && grid[x][y - 1] == '@') count++;
  if (!right && grid[x][y + 1] == '@') count++;

  // row below
  if (!bottom) {
    if (!left && grid[x + 1][y - 1] == '@') count++;
    if (grid[x + 1][y] == '@') count++;
    if (!right && grid[x + 1][y + 1] == '@') count++;
  }

  return count < 4;
}

// read in input
file.on('line', (line) => {
  grid.push(line.split(''));
});

file.on('close', () => {
  var total = 0;

  // loop over grid and count surrounding spaces
  var removedThisRound = 1;

  while (removedThisRound > 0) {
    removedThisRound = 0;
    for (var i = 0; i < grid.length; ++i) {
      for (var j = 0; j < grid[i].length; ++j) {
        if (grid[i][j] == '@') {
          if (canBeRemoved(i, j)) {
            grid[i][j] = 'x';
            removedThisRound++;
          }
        }
      }
    }

    total += removedThisRound;
  }

  console.log(total);
});
