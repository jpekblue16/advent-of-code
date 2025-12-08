const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day5_test.txt' : 'day5_input.txt'),
  output: process.stdout,
  terminal: false,
});

// given a set of ranges indicating 'fresh' item IDs and a list of IDs to test, determine how many are 'fresh'

var readingRanges = true;

// list of ranges
// each range is a 2-element array (inclusive) = [start,end]
var ranges = [];

var total = 0;

// determine if given item is fresh
// item is fresh if it falls within any range within list of ranges
function isFresh(item) {
  for (var range of ranges) {
    if (item >= range[0] && item <= range[1]) return true; // item falls within a range
  }

  return false;
}

file.on('line', (line) => {
  if (readingRanges) ranges.push(line.split('-').map((v) => Number(v)));
  else {
    // check if item falls within any ranges
    if (isFresh(Number(line))) total++;
  }

  if (line === '') readingRanges = false;
});

file.on('close', () => {
  console.log(total);
});
