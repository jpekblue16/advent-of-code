const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'day3_test.txt' : 'day3_input.txt'),
  output: process.stdout,
  terminal: false,
});

/* given a string of digits, find largest 2 digit number among pairs of individual digits, kept in same order
   
  eg

  987654321111111 - _9__8_7654321111111 - 98
  811111111111119 - _8_1111111111111_9_ - 89
  234234234234278 - 2342342342342_7__8_ - 78
  818181911112111 - 818181_9_1111_2_111 - 92

*/

var total = 0;

// process each line of digits
file.on('line', (line) => {
  //find largest number of string (excluding last digit)
  var maxFirstDigit = { index: 0, value: Number(line.at(0)) };

  // find largest digit for tens place
  for (var i = 1; i < line.length - 1; ++i) {
    if (Number(line.at(i)) > maxFirstDigit.value)
      maxFirstDigit = { index: i, value: Number(line.at(i)) };
  }

  // find largest digit for ones place
  var maxSecondDigit = Number(line.at(maxFirstDigit.index + 1));
  for (var i = maxFirstDigit.index + 2; i < line.length; ++i) {
    if (Number(line.at(i)) > maxSecondDigit)
      maxSecondDigit = Number(line.at(i));
  }

  total += Number(maxFirstDigit.value + '' + maxSecondDigit);
});

file.on('close', () => {
  console.log(total);
});
