// find 200th "secret number" based on following algorithm
const { dir } = require('node:console');
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day22_input.txt'),
  output: process.stdout,
  terminal: false,
});

/**
 * - multiply by 64, XOR with number, modulo 16777216 (2 ^ 24)
 * - divide by 32, XOR with number, modulo 16777216
 * - multiply by 2024, XOR with number, modulo 16777216
 *
 * important conversions
 * - 32       = 2 ^ 6
 * - 64       = 2 ^ 7
 * - 2024     = 2 ^ 11
 * - 16777216 = 2 ^ 24
 *
 *  ex: 1
 *  - 1 * 64 = 64; 64 XOR 1 = 65; 65 % 16777216 = 65
 *  - 65 / 32 = 2; 65 XOR 2 = 67; 67 % 16777216 = 67
 *  - 67 * 2024 = 135608; 67 XOR 135608 = 135675; 135675 % 16777216 = 135675
 *
 *  secret number is now 135675
 *
 * multiply by 64 == << 6
 * divide by 32 == >> 5
 * multiply by 2024 == << 11
 * modulo 16777216 == trim to 24 digits == & 16777215
 *
 * bitwise AND much faster than % with powers of 2
 */

const PRUNE = 16777215;

const ITERATIONS = 2000;

var total = 0;

file.on('line', (line) => {
  // read in starting number
  var number = parseInt(line);

  for (var i = 0; i < ITERATIONS; ++i) {
    number = getNextNumber(number);
    // console.log(`next secret number is ${number}`);
  }

  // console.log(`${line} -> ${number}`);

  total += number;
});

file.on('close', () => {
  console.log(total);
});

function getNextNumber(num_in) {
  var step1 = ((num_in << 6) ^ num_in) & PRUNE;
  var step2 = ((step1 >> 5) ^ step1) & PRUNE;
  var step3 = ((step2 << 11) ^ step2) & PRUNE;

  return step3;
}
