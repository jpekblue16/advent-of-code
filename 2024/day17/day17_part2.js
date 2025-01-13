const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day17_test.txt'),
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

/* 
    Need to find smallest initial value for A that results in the set of instructions

    B and C start at 0
    
    Essentially need to know how many times to loop with jump
    input is nice:
      only 1 jump at the end
      only 1 output, right before jump
      need to jump # of times = instructions length - 1
      X must end as 0 to break out of jump

    0,1,5,4,3,0 = 
    - X must end as multiple of 8 + output operand, can't be 0
    - operand is value in reg A, 
    - end at 0: X / 2 <instructions.length> times - combo(4)*2^instructions length % 8 = 0
*/

var instructions = [];

// read in initial register values and instructions
file.on('line', (line) => {
  // ignore initial register values, only read instruction line
  if (line.indexOf('Program') >= 0) {
    instructions = Array.from(line.substring(9).split(','), (v) => parseInt(v));
  }
});

file.on('close', () => {
  // note which register the output is reading from (must be reading from a register for value to be dependent on A)
  var outRegister = instructions[instructions.indexOf(5) + 1] - 4;

  // hold all the operations performed each loop (given output operation is 2nd to last)
  var loop = instructions.slice(0, instructions.at(-4));

  // hold value for each register in case output is based on any of them
  // last output value is always 0, and 0 % 8 is lowest 0 value
  var result = [0, 0, 0];

  for (var v of instructions.toReversed()) {
    // extract values for easier reading
    var output = v;
    // looping backwards over the loop operations to determine source value
    for (var op = loop.length - 2; op >= 0; op -= 2) {
      // find new lowest value registers would need to be for operation to yeild result
      undoOp(loop[op], loop[op + 1], result, outRegister);
    }
  }
});

function undoOp(operation, operand, registers, outReg) {
  switch (operation) {
    //division operations - result = numerator / denominator -> numerator(A) = result * denominator
    case 0:
    case 6:
    case 7:
      // A is always the numerator, denominator is 2 ^ (input)
      // literal operand
      if (operand <= 3) {
        registers[0] =
          registers[getStorageRegister(operation)] * Math.pow(2, operand);
      }
      // if operand is 4 (reg A), result will always be 0 (since 2^A > A)
      else if (operand == 4) {
        registers[0] = 0;
      } else {
        registers[0] =
          registers[getStorageRegister(operation)] *
          Math.pow(2, comboOperand(operand, registers));
      }
      break;
    // XOR - both store in B
    case 1:
    // B and <literal input>
    case 4:
    // B and C
    // mod 8
    case 2:
    // <combo input> % 8 into B
  }
}

// returns the register index for the given operation
// 0 is A, 7 is C, rest will be B
function getStorageRegister(operation) {
  if (operation == 0) return 0;
  if (operation == 7) return 2;
  return 1;
}
