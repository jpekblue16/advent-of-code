const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day7_input.txt'),
  output: process.stdout,
  terminal: false,
});

// for each line, find combination of add/multiply operations that result in the test value

var total = 0;

const OPERATIONS = ['add', 'mult', 'concat'];

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
  for (var c = Math.pow(3, numOperations) - 1; c >= 0; --c) {
    var result = operands[0];

    // convert to ternary
    var opString = c.toString(3).padStart(numOperations, '0');
    var opArray = Array.from(opString.split(''), (v) => parseInt(v));

    // process each operation, 0 = add, 1 = multiply
    for (var i = 0; i < numOperations; ++i) {
      switch (opArray[i]) {
        case 0:
          result += operands[i + 1];
          break;
        case 1:
          result *= operands[i + 1];
          break;
        case 2:
          result = parseInt((result += '' + operands[i + 1]));
          break;
        default:
          throw 'BAD';
      }
      if (result > test) break;
    }

    if (result == test) return true;
  }

  return false;
}
