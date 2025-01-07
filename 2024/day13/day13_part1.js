const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day13_input.txt'),
  output: process.stdout,
  terminal: false,
});

/*

    given system of equations
    x1 * A + y1 * B = z1
    x2 * A + y2 * B = z2

    3 * A + B = C

    minimize C

    A,B <= 100

    eg
    94A + 22B = 8400
    34A + 67B = 5400

    ans A = 80, B = 40 -> C = 280

*/

// linear equations, so should just need to find one solution where both A and B are integers not greater than 100

// process whole input
var numRegex = /[0-9]+/g;

// hold each system in array
var machines = [];
var lineCount = 0;

file.on('line', (line) => {
  // skip empty lines
  if (line.trim() == '') return;
  //find numbers in line
  var numbers = Array.from(line.matchAll(numRegex), (v) => parseFloat(v[0]));
  switch (lineCount) {
    // first line of machine, numbers are x1 and y1
    case 0:
      machines.push({ x1: numbers[0], y1: numbers[1] });
      break;
    // second line of machine, numbers are x2 and y2
    case 1:
      var machine = machines.at(-1);
      machine.x2 = numbers[0];
      machine.y2 = numbers[1];
      break;
    // third line of machine, numbers are z1 and z2 (totals)
    case 2:
      var machine = machines.at(-1);
      machine.z1 = numbers[0];
      machine.z2 = numbers[1];
      break;
    default:
      throw 'BAD';
  }

  lineCount = (lineCount + 1) % 3;
});

// process each machine
file.on('close', () => {
  var total = 0;
  // loop over each machine and add the cost to get the prize (0 if impossible)
  for (var m of machines) {
    total += getCost(m);
  }
  console.log(total);
});

function getCost(m) {
  // find intersection of equations
  //   console.log(`${m.x1}A + ${m.x2}B = ${m.z1}`);
  //   console.log(`${m.x2}A + ${m.y2}B = ${m.z2}`);
  //   console.log('-'.repeat(24));

  var bPresses = (m.z2 - (m.y1 * m.z1) / m.x1) / (m.y2 - (m.y1 * m.x2) / m.x1);
  var aPresses = (m.z1 - m.x2 * bPresses) / m.x1;

  // round values
  bPresses = Math.round(bPresses * 100) / 100;
  aPresses = Math.round(aPresses * 100) / 100;

  // verify both values
  if (isValid(aPresses) && isValid(bPresses))
    return 3 * Math.floor(aPresses) + Math.floor(bPresses);

  return 0;
}

// returns true if i is an integer less than or equal to 100
function isValid(i) {
  return i <= 100 && i % 1 === 0;
}
