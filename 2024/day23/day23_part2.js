const { dir } = require('node:console');
const fs = require('node:fs');
const { truncate } = require('node:fs/promises');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day23_input.txt'),
  output: process.stdout,
  terminal: false,
});

// NOTE - adjacency list is very sparse; ~500 unique pcs, each has 13 connections

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
// want to find largest group of pcs that all connect to each other
file.on('close', () => {
  // track the largest group found so far
  var largest = [];

  // loop over each pc
  for (var [pc, connected] of connections.entries()) {
    var curCluster = makeBiggestCluster([pc], connected);

    if (curCluster.length > largest.length) largest = curCluster;
  }

  // output is the largest group, sorted alphabetically, joined by commas
  console.log(largest.toSorted().join());
});

// determines if a is connected to b
function isConnected(a, b) {
  try {
    return connections.get(a).indexOf(b) >= 0;
  } catch (e) {
    throw e;
  }
}

//
function makeBiggestCluster(cluster, remaining) {
  var result = cluster;

  if (remaining.length == 0) return result;

  for (var [i, conn] of remaining.entries()) {
    // if conn is connected to each node in the cluster
    var fullyConnected = true;
    for (var e of cluster) {
      if (!isConnected(conn, e)) {
        fullyConnected = false;
        break;
      }
    }

    // if conn is connected to the entire cluster,
    // find the biggest cluster with it added to the current cluster
    if (fullyConnected) {
      var newRemaining = remaining
        .slice(0, i)
        .concat(remaining.length > 1 ? remaining.slice(i + 1) : []);
      var newCluster = makeBiggestCluster([...cluster, conn], newRemaining);
      if (newCluster.length > result.length) {
        result = newCluster;
      }
    }
  }

  return result;
}
