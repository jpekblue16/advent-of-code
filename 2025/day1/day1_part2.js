const fs = require('node:fs');
const readline = require('readline');

const testing = false;

const file = readline.createInterface({
  input: fs.createReadStream(testing ? 'day1_test.txt' : 'day1_input.txt'),
  output: process.stdout,
  terminal: false,
});

/*
  safe with a dial, values 0 - 99; wraps around 99 -> 0
  given set of instructions with direction + distance of rotation - L23,R45,etc
  move to right = increase dial value, move left = decrease
  find number of times where dial passes or ends on 0 during a move
*/

// dial starts at 50
var dialAt = 50,
  count = 0;

function modulo(x, n) {
  return ((x % n) + n) % n;
}

// store all instructions
file.on('line', (line) => {
  var direction = line.at(0);

  var distance = Number(line.substring(1));

  // count number of full rotations
  count += Math.floor(distance / 100);
  distance = distance % 100;

  var endAt = direction == 'R' ? dialAt + distance : dialAt - distance;

  // console.log(line);
  // console.log(`start from ${dialAt}; end at ${endAt}`);

  // check if 0 was passed or hit by remaining distance
  if (dialAt > 0 && (endAt >= 100 || endAt <= 0)) {
    // console.log('passed 0');
    count++;
  }

  dialAt = modulo(endAt, 100);
  // console.log(`dial now at ${dialAt}`);
});

file.on('close', () => {
  console.log(count);
});
