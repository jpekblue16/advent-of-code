const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

var grid = [];

file.on('line', (line) => {
  grid.push(line.split(''));
});

file.on('close', () => {
  // loop down grid lines
  // starting from S
  // check next row
  // if . continue down to next line, if ^, continue on left and right of index

  // no ^ on last row, laser will never go past left/right edges, no adjacent ^s

  // if S or |, check next line down
  //  if ., change to |
  //  if ^, change pos-1 and pos+1 to |

  var splits = 0;
  for (var i = 0; i < grid.length - 1; ++i) {
    // loop over rows

    // loop over the row
    for (var j = 0; j < grid[i].length; ++j) {
      // check next line
      if (grid[i][j] == 'S' || grid[i][j] == '|') {
        var next = grid[i + 1][j];
        if (next == '^') {
          grid[i + 1][j - 1] = '|';
          grid[i + 1][j + 1] = '|';
          ++splits;
        } else grid[i + 1][j] = '|';
      }
    }
  }

  console.log(splits);
});
