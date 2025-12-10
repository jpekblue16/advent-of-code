const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

// read in lines representing simple addition or multiplication

/*
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  

Reading the problems right-to-left one column at a time, the problems are now quite different:

    The rightmost problem is 4 + 431 + 623 = 1058
    The second problem from the right is 175 * 581 * 32 = 3253600
    The third problem from the right is 8 + 248 + 369 = 625
    Finally, the leftmost problem is 356 * 24 * 1 = 8544

Now, the grand total is 1058 + 3253600 + 625 + 8544 = 3263827.
*/

var lines = [];

file.on('line', (line) => {
  lines.push(line);
});

function doOperation(operands, operator) {
  return operator == '+'
    ? operands.reduce((a, v) => a + v, 0)
    : operands.reduce((a, v) => a * v, 1);
}

file.on('close', () => {
  // step through all lines
  // each column represents one operand
  // digits are read top down, spaces will either be all above digits or all below

  var total = 0;

  // iterate over each column, gather set of operands

  var operands = [];
  var curOp = '';
  for (var i = 0; i < lines[0].length; ++i) {
    // look for operator in last line
    if (lines[lines.length - 1].at(i) != ' ') {
      // if operation queued, perform operation using stored operands
      if (curOp != '') {
        total += doOperation(operands, curOp);
      }

      // get new operator
      curOp = lines[lines.length - 1].at(i);
      operands = [];
    }

    // get next operand
    var number = '';
    for (var j = 0; j < lines.length - 1; ++j) {
      number += lines[j].at(i);
    }
    if (number.trim() != '') operands.push(Number(number.trim()));
  }

  total += doOperation(operands, curOp);

  console.log(total);
});
