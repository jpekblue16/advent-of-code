const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day2_test.txt' : 'day2_input.txt'),
  output: process.stdout,
  terminal: false,
});

// find sum all values within all given ranges of numbers that are repeated ("invalid")
// ie 11, 22, 123123, 34563456, etc

// checks if given number string is "invalid"
function isInvalid(s) {
  // one or more digits, repeated one or more times, surrounded by word boundaries
  const regex = /\b(\d+)\1+\b/;

  return s.match(regex);
}

// file will only contain 1 line of input
file.on('line', (line) => {
  // array of ranges
  var ranges = line.split(',');

  var total = 0;

  // for each range, check number of digits of start and end, look for all duplicates
  for (var range of ranges) {
    var [start, end] = range.split('-');

    // brute force - check every number in range
    for (var i = Number(start); i <= Number(end); ++i) {
      if (isInvalid(i.toString())) {
        console.log('found invalid number: ' + i);
        total += i;
      }
    }
  }

  console.log(total);
});
