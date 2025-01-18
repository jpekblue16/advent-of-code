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
var valid = 0;

// track number of ways to make all valid combos
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
    // check number of valid combinations
    var count = possibleArrangements(line);
    if (count > 0) valid++;
    result += count;
    total++;
  }
});

// display result
file.on('close', () => {
  console.log(`${result} ways to make ${valid} valid / ${total} total`);
});

// returns number of possible combinations
var found = new Map();
function possibleArrangements(design) {
  // return count of all valid combinations

  // empty design has 0 ways - exact match will already increment
  if (design == '') return 0;

  // if design has already been seen, return its count
  if (found.has(design)) return found.get(design);

  var count = 0;

  // get all patterns that match the first char of the design
  var firstCharMatches = patterns.get(design[0]);

  // starting with the longest patterns (not longer than string)
  for (
    var i = Math.min(firstCharMatches.length - 1, design.length);
    i > 0;
    i--
  ) {
    // get all patterns of that length
    var lengths = firstCharMatches[i];

    // if no matches of that length, skip
    if (!lengths) continue;

    // for each pattern of that length
    for (var pattern of lengths) {
      // if the pattern is an exact match, add 1 to count but keep going
      if (pattern == design) count++;

      // add count for the rest of the string
      // if pattern matches the beginning of the string
      // if rest of string is impossible, will still be 0
      if (pattern == design.substring(0, pattern.length))
        count += possibleArrangements(design.substring(pattern.length));
    }
  }

  // all patterns checked
  // if count is 0, design is impossible
  found.set(design, count);
  return count;
}
