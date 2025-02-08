const { dir } = require('node:console');
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day23_input.txt'),
  output: process.stdout,
  terminal: false,
});

// given list of connected computer pairs, find all groups of 3 connected computers with at least one that starts with 't'

// read in connections; will be in format 'ab-bc'
// pcs will not be connected to themselves
var connections = new Map();
file.on('line', (line) => {
  var [pc1, pc2] = line.split('-');

  // add each to the other's connected set
  // if not in map, create entry with empty set
  if (!connections.has(pc1)) connections.set(pc1, []);
  if (!connections.has(pc2)) connections.set(pc2, []);

  // add to each set
  connections.get(pc1).push(pc2);
  connections.get(pc2).push(pc1);
});

// process connections
// find all groups of three interconnected pcs that have at least 1 pc that starts with t
file.on('close', () => {
  var trios = new Set();

  // find all trios of connected pcs
  for (var [key, value] of connections.entries()) {
    // for each pc, check each pair of connections
    // if those are connected, a trio is made
    // need to not double/triple count

    if (key.substring(0, 1) != 't') continue;

    // nested loop over connections
    for (var i = 0; i < value.length - 1; ++i) {
      for (var j = i + 1; j < value.length; ++j) {
        // check if i and j are connected
        if (isConnected(value[i], value[j])) {
          var trio = [key, value[i], value[j]].toSorted();
          trios.add(`${trio[0]}-${trio[1]}-${trio[2]}`);
        }
      }
    }
  }

  console.log(trios.size);
});

function isConnected(a, b) {
  return connections.get(a).indexOf(b) >= 0;
}
