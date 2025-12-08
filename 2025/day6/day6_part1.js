const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

var lines = [];

file.on('line', (line) => {
  lines.push(line.trim().split(/\s+/));
});

file.on('close', () => {
  var total = 0;

  // loop through lines, doing calculations
  for (var i = 0; i < lines[0].length; ++i) {
    var operator = lines[lines.length - 1][i];

    // set starting value based on operation
    var result = operator == '+' ? 0 : 1;

    // loop over all operands (exclude last line)
    for (var j = 0; j < lines.length - 1; ++j) {
      if (operator == '+') result += Number(lines[j][i]);
      else result *= Number(lines[j][i]);
    }

    total += result;
  }

  console.log(total);
});
