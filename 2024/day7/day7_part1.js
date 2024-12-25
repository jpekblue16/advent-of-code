const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day7_input.txt'),
  output: process.stdout,
  terminal: false,
});

// for each line, find combination of add/multiply operations that result in the test value

var total = 0;

file.on('line', (line) => {
  // read in test value and operands
  var testValue = parseInt(line.substring(0, line.indexOf(':')));
  var operands = Array.from(
    line.substring(line.indexOf(' ') + 1).split(' '),
    (v) => parseInt(v)
  );

  if (isValid(testValue, operands)) total += testValue;
});

file.on('close', () => {
  console.log(total);
});

function isValid(test, operands) {
  var numOperations = operands.length - 1; // (2^numoperations - 1) - # of different combinations

  // test all combinations, start with all multiply
  for (var c = Math.pow(2, numOperations) - 1; c >= 0; --c) {
    var result = operands[0];

    // process each operation, 0 = add, 1 = multiply
    for (var i = 0; i < numOperations; ++i) {
      if (((c >> i) & 1) === 1) {
        result *= operands[i + 1];
      } else {
        result += operands[i + 1];
      }

      if (result > test) break;
    }

    if (result == test) return true;
  }

  return false;
}
