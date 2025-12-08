const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day5_test.txt' : 'day5_input.txt'),
  output: process.stdout,
  terminal: false,
});

// first attempt - brute force; add all fresh IDs to a Set and check Set size at end; Set too large

// second attempt - with each new set, check if it overlaps with an existing set and merge if so

/*
  4 kinds of overlap?

  1
    s1 --------------- e1
        s2 ------- e2

  2
    s1 ----------- e1
        s2 ------------- e2

  3
        s1 ----------- e1
    s2 ----------- e2

  4
        s1 ----- e1
    s2 ---------------- e2
*/

var readingRanges = true;

// each range is an object with start and end properties
var ranges = [];

file.on('line', (line) => {
  if (line === '') readingRanges = false;
  if (readingRanges) {
    ranges.push(line.split('-').map((v) => Number(v)));
  }
});

// merges the list of ranges
// ranges are sorted by starting value
function merge(ranges) {
  var result = [];

  for (var range of ranges) {
    // if first range or if next range starts after the end of the most recent merge, add to result
    if (result.length == 0 || result[result.length - 1][1] < range[0]) {
      result.push(range);
    }
    // overlap is found, set end of current merge
    else {
      result[result.length - 1] = [
        result[result.length - 1][0], // start of current merge
        Math.max(result[result.length - 1][1], range[1]), // maximum of: end of current merge and end of the range
      ];
    }
  }

  return result;
}

file.on('close', () => {
  // merge all ranges

  // sort by starting value
  ranges.sort((a, b) => a[0] - b[0]);

  var mergedRanges = merge(ranges);

  var total = 0;
  for (var range of mergedRanges) total += range[1] - range[0] + 1;

  console.log(total);
});
