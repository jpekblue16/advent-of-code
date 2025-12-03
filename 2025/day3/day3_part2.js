const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day3_test.txt' : 'day3_input.txt'),
  output: process.stdout,
  terminal: false,
});

/* given a string of digits, find largest *12* digit number among pairs of individual digits, kept in same order
   
  eg

  987654321111111 -> 987654321111
  811111111111119 -> 811111111119
  234234234234278 -> 434234234278
  818181911112111 -> 888911112111

*/
const DIGITS = 12;

var total = 0;

// finds index of the greatest digit in a string of digits
function findMaxDigit(s) {
  return s.indexOf(Math.max(...s.split('').map((v) => Number(v))));
}

// process each line of digits
file.on('line', (line) => {
  // for 12 digits, find the largest digit in the range of 0/prev digit to length - digit_number
  // ie find the largest digit before the last 11, then the last between that index and the last 10 digits, etc

  // track string of largest digits found
  var result = '';

  // index of most recently found digit
  var curIndex = 0;

  // find the ith digit
  for (var i = 0; i < DIGITS; ++i) {
    // find max index in the range of [index of previous digit+1, end of string minus remaining # of digits)
    var maxIndex = findMaxDigit(
      line.substring(curIndex, line.length - DIGITS + i + 1)
    );

    result += line.at(maxIndex + curIndex);

    curIndex = maxIndex + curIndex + 1;
  }

  total += Number(result);
});

file.on('close', () => {
  console.log(total);
});
