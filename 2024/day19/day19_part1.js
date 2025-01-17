const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day19_input.txt'),
  output: process.stdout,
  terminal: false,
});

// given set of available patterns and desired combinations,
// determine how many combinations are possible to make

// track valid combinations
var result = 0;

// track total combinations
var total = 0;

// read in available patterns
// for each combination, determine if it is possible to make using only the patterns
var patterns = new Map([
  ['w', [['']]],
  ['u', [['']]],
  ['b', [['']]],
  ['r', [['']]],
  ['g', [['']]],
]);

var patternsRead = false;
file.on('line', (line) => {
  if (!patternsRead) {
    var patternArray = line.split(', ');

    // organize the patterns into map keyed on first letter and separated by length
    patternArray.forEach((v) => {
      if (patterns.get(v[0])[v.length]) patterns.get(v[0])[v.length].push(v);
      else patterns.get(v[0])[v.length] = [v];
    });

    patterns.forEach((v) =>
      v.forEach((v1) => {
        v1.sort((a, b) => {
          if (a == undefined || b == undefined) return 0;
          if (a.length < b.length) return -1;
          if (a.length > b.length) return 1;
          return 0;
        });
      })
    );
    patternsRead = true;
  } else if (line != '') {
    // check if combination is possible to make
    total++;
    if (isPossible(line)) result++;
  }
});

// display result
file.on('close', () => {
  console.log(`${result} valid / ${total} total`);
});

// returns true if the given design can be made using any combination of the saved patterns
var impossible = new Set();
function isPossible(design) {
  // empty design is always possible
  if (design == '') return true;

  // if the string was already found to be impossible, return
  if (impossible.has(design)) return false;

  // starting at longest patterns,
  // compare each to the same amonut of characters from the beginning of the string
  var firstCharMatches = patterns.get(design[0]);
  for (var patternLength of firstCharMatches
    .filter((v, i) => i <= design.length)
    .toReversed()) {
    // patternLength will be array of each pattern with the same length

    // if no patterns of that length, continue
    if (patternLength[0] == '') continue;

    // check each pattern of that length
    for (var pattern of patternLength) {
      // if pattern matches the string return true
      if (pattern == design) return true;

      // if the pattern matches the beginning of the design
      if (pattern == design.substring(0, pattern.length)) {
        // check if the remaining segment of the design is possible
        if (isPossible(design.substring(pattern.length))) {
          // if the rest of the design is possible, the design is possible
          return true;
        }
      }
      // no more matches of length patternLength
    }
  }
  // all patterns checked, no match
  impossible.add(design);
  return false;
}
