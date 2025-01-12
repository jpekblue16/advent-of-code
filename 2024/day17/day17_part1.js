const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day17_input.txt'),
  output: process.stdout,
  terminal: false,
});

/*
    opcode 0 - division - divide the value in register A by 2^<combo input>, store in A
    opcode 1 - bitwise xor - bitwise xor of B and <literal input>, store in B
    opcode 2 - mod 8 - <combo input> mod 8 and store in B
    opcode 3 - jump - set instruction pointer to <literal input>
    opcode 4 - bitwise xor of B and C, store in B (input unused)
    opcode 5 - out - modulo 8  of <combo input>, output result
    opcode 6 - bdiv - divide A by 2^<combo input>, store in B
    opcode 7 - cdiv - divide A by 2^<combo input>, store in C

    literal input - uses the actual number
    combo input - 0,1,2,3 = actual number
                - 4 = register A
                - 5 = register B
                - 6 = register C
                - 7 = not used
*/

// 0 = A, 1 = B, 2 = C
var registers = [];
var instructions = [];

// read in initial register values and instructions
file.on('line', (line) => {
  if (line == '') return;
  if (registers.length < 3) {
    registers.push(parseInt(line.match(/[0-9]+/)[0]));
  } else {
    instructions = Array.from(line.substring(9).split(','), (v) => parseInt(v));
  }
});

file.on('close', () => {
  // process instructions and perform operations

  // hold output
  var output = [];
  // each instruction uses 2 numbers
  for (var pointer = 0; pointer < instructions.length; ) {
    // jump if reg A is not 0
    if (instructions[pointer] == 3) {
      pointer = registers[0] != 0 ? instructions[pointer + 1] : pointer + 2;
      continue;
    }

    var operand = null;
    switch (instructions[pointer]) {
      // process with combo input
      case 0:
      case 2:
      case 5:
      case 6:
      case 7:
        operand = getComboInput(instructions[pointer + 1]);
        break;
      case 1:
        operand = instructions[pointer + 1];
        break;
    }

    var result = doOperation(instructions[pointer], operand);

    if (result !== undefined) output.push(result);

    pointer += 2;
  }

  console.log(output.join(','));
});

function doOperation(opcode, operand) {
  switch (opcode) {
    case 0:
      // divide A by 2^operand into A
      registers[0] = doDivision(operand);
      break;
    case 1:
      // bitwise xor of B and operand into B
      registers[1] = registers[1] ^ operand;
      break;
    case 2:
      // operand mod 8 into B
      registers[1] = operand % 8;
      break;
    // opcode 3 already handled
    case 4:
      // bitwise xor of B and C into B
      registers[1] = registers[1] ^ registers[2];
      break;
    case 5:
      return operand % 8;
    case 6:
      registers[1] = doDivision(operand);
      break;
    case 7:
      registers[2] = doDivision(operand);
      break;
  }
}

function doDivision(op) {
  return Math.floor(registers[0] / Math.pow(2, op));
}

// return the value to use given the combo operand
function getComboInput(operand) {
  switch (true) {
    case operand <= 3:
      return operand;
    case operand > 3 && operand < 7:
      return registers[operand - 4];
    default:
      throw 'INVALID COMBO OPERAND';
  }
}
