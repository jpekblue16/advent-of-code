const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day10_test.txt'),
  output: process.stdout,
  terminal: false,
});

var map = [];

file.on('line', (line) => {
  map.push(
    Array.from(line, (v) => {
      return { visited: false, value: parseInt(v) };
    })
  );
});

file.on('close', () => {
  var score = 0;

  // read through the map
  for (var i = 0; i < map.length; ++i) {
    for (var j = 0; j < map.length; ++j) {
      var cur = map[i][j];

      if (cur == 0) {
        // start searching from that point
        score += getScore(i, j);
      }
    }
  }

  console.log(score);
});

// input - x and y coordinates of the starting point
// returns score for this start point
function getScore(x, y) {
  var result = 0;
  // start searching in each direction

  // use stack to track the path
  var path = [];

  path.push(grid[(x, y)]);

  return result;
}
