const fs = require('node:fs');
const readline = require('readline');

const TESTING = false;

const file = readline.createInterface({
  input: fs.createReadStream(TESTING ? 'test.txt' : 'input.txt'),
  output: process.stdout,
  terminal: false,
});

// given a list of nodes (3D coordinates), after "connecting" the 1000 closest nodes, find product of the three longest chains

function Node(x, y, z) {
  return { x: x, y: y, z: z };
}

var nodes = [];

file.on('line', (line) => {
  nodes.push(Node(...line.split(',').map((v) => Number(v))));
});

function getEuclideanDistance(a, b) {
  return Math.sqrt(
    Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2)
  );
}

// find all distances and sort?
file.on('close', () => {
  // get all distances
  var distances = [];

  for (var i = 0; i < nodes.length; ++i) {
    for (var j = i + 1; j < nodes.length; ++j) {
      // create array of objects showing the two nodes and how far apart they are
      distances.push({
        nodeA: i,
        nodeB: j,
        distance: getEuclideanDistance(nodes[i], nodes[j]),
      });
    }
  }

  // sort by shortest distance
  distances.sort((a, b) => a.distance - b.distance);

  // holds sets of linked nodes
  var circuits = [];

  // make the 1000 shortest connections
  for (var i = 0; i < (TESTING ? 10 : 1000) && i < distances.length; ++i) {
    // make connection
    var connection = distances[i];

    // find set for node a and set for node b
    var nodeASet = -1,
      nodeBSet = -1;
    circuits.forEach((v, i) => {
      if (v.has(connection.nodeA)) nodeASet = i;
      if (v.has(connection.nodeB)) nodeBSet = i;
    });

    // if both are -1, create new circuit
    if (nodeASet == nodeBSet) {
      if (nodeASet == -1) {
        circuits.push(new Set([connection.nodeA, connection.nodeB]));
      }
    } else {
      // if A not in a set, add to B's set
      if (nodeASet == -1) {
        circuits[nodeBSet].add(connection.nodeA);
      }
      // if B not in set, add to A's set
      else if (nodeBSet == -1) {
        circuits[nodeASet].add(connection.nodeB);
      }
      // both nodes in different sets, merge sets
      else {
        // add all of b's nodes to a
        circuits[nodeBSet].forEach((v) => {
          circuits[nodeASet].add(v);
        });

        // clear b
        circuits[nodeBSet].clear();
      }
    }
  }

  // sort circuits by size
  circuits.sort((a, b) => b.size - a.size);

  // multiply size of 3 largest circuits
  console.log(circuits[0].size * circuits[1].size * circuits[2].size);
});
