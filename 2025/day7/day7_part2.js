const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

// find number of permutations of laser path through grid

// track number of overlapping lasers at each point, add number of overlaps when splitting

var grid = [];

file.on('line', (line) => {
  grid.push(
    line.split('').map((c) => {
      if (c == 'S') return 1;
      else if (c == '.') return 0;
      else return c;
    })
  );
});

file.on('close', () => {
  for (var i = 0; i < grid.length - 1; ++i) {
    // loop over rows

    // loop over the row
    for (var j = 0; j < grid[i].length; ++j) {
      // if laser at current position, look at next row
      if (typeof grid[i][j] == 'number' && grid[i][j] > 0) {
        // if splitter found, add number to left and right of it
        if (grid[i + 1][j] == '^') {
          grid[i + 1][j - 1] += grid[i][j];
          grid[i + 1][j + 1] += grid[i][j];
        }
        // otherwise, add number below
        else {
          grid[i + 1][j] += grid[i][j];
        }
      }
    }
  }

  // sum up all numbers in last row

  console.log(grid[grid.length - 1].reduce((a, v) => a + v, 0));
});
