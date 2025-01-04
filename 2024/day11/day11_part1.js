const fs = require('node:fs');
const { get } = require('node:http');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day11_input.txt'),
  output: process.stdout,
  terminal: false,
});

var BLINKS = 75;

file.on('line', (line) => {
  var stones = line.split(' ');

  var total = 0;

  for (var stone of stones) {
    total += getStoneTotal(parseInt(stone), BLINKS);
  }

  console.log(total);
});

// save calculations for a given number and rounds to run
// when returning a calculation up the chain, write the result to the hashmap
var hashMap = new Map();

// recursively calculate the number of stones resulting from a value after a certain amount of blinks/rounds
// returns the total number of stones produced from the given value
function getStoneTotal(value, roundsLeft) {
  // base case, no more blinks
  if (roundsLeft <= 0) {
    return 1;
  }

  // if value is 0, return total of 1 with rounds -
  if (value == 0) {
    var result = getStoneTotal(1, roundsLeft - 1);
    addToMap(value, roundsLeft, result);
    return result;
  }

  // check hash map for the calculation
  if (hashMap.has(value) && hashMap.get(value)[roundsLeft] != undefined) {
    return hashMap.get(value)[roundsLeft];
  }

  // new calculation
  var valueString = value.toString();

  // if even number of digits, split into 2 and add
  if (valueString.length % 2 == 0) {
    var midpoint = Math.floor(valueString.length / 2);

    var result =
      getStoneTotal(
        parseInt(valueString.substring(0, midpoint)),
        roundsLeft - 1
      ) +
      getStoneTotal(parseInt(valueString.substring(midpoint)), roundsLeft - 1);

    addToMap(value, roundsLeft, result);
    return result;
  }

  // odd number of digits, multiply value by 2024 and recurse
  var result = getStoneTotal(value * 2024, roundsLeft - 1);
  addToMap(value, roundsLeft, result);
  return result;
}

// key map on values -> rounds
// expect large range of values, fixed # of rounds
// better to have smaller mostly empty arrays
function addToMap(value, rounds, result) {
  if (!hashMap.has(value)) hashMap.set(value, Array(BLINKS));

  hashMap.get(value)[rounds] = result;
}
