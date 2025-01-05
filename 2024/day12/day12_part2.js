const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day12_input.txt'),
  output: process.stdout,
  terminal: false,
});

// store grid as 2d matrix
var grid = [];
var lineCount = 0;

file.on('line', (line) => {
  grid.push(
    Array.from(line.split(''), (v, i) => {
      // store each point's x and y coordinates for easy access / less passing x and y coordinates as arguments
      return {
        x: lineCount,
        y: i,
        visited: false,
        label: v,
        connectedDirs: new Set(),
      };
    })
  );
  lineCount++;
});

// walk through the grid and calculate the total
file.on('close', () => {
  var total = 0;
  // loop through grid
  for (var row of grid) {
    for (var space of row) {
      // if the space isnt visited, find its plot and add its value
      // getting plot will mark spaces as visited
      if (!space.visited) {
        var plot = getPlot(space);

        total += plot.area * plot.sides;
      }
    }
  }

  console.log(total);
});

// starting from the given point, find all connected spaces with a matching labels
// with depth first search, will progress in one direction as much as possible
// want to find number of continuous sides
// # sides == # corners
// - visit node
//   - check for adjacent unconnected directions
//   - check for any directions that were connected and now are not
function getPlot(start) {
  // use a depth first search to find connected nodes
  // remember previous from when the node was added
  var queue = [];
  queue.push({ node: start, prev: start });

  // track the plot's area and perimeter
  // start with 1 as perimeter, then add up to 3 for each non-adjacent edge
  var plot = {
    area: 0,
    sides: 0,
  };

  while (queue.length > 0) {
    var cur = queue.pop();

    // if node is already visited, skip it
    if (cur.node.visited) continue;

    // visit current node and add to plot
    cur.node.visited = true;
    plot.area++;

    // find all adjacent spaces
    var adjacent = getAdjacent(cur.node);

    // check each adjacent pair of directions
    plot.sides += countCorners(cur.node, adjacent);

    queue.push(
      ...adjacent
        .filter((v) => v !== null)
        .map((v) => {
          return { node: v, prev: cur.node };
        })
    );
  }

  return plot;
}

// checks if there are any corners at the current point
// outer corners - adjacent directions are both null
// inner corners - if adjacent directions are both connected,
//                 check if the diagonal between them is connected
//                 if no, corner found
function countCorners(point, adjacent) {
  var count = 0;
  for (var i = 0; i < adjacent.length; i++) {
    var next = (i + 1) % adjacent.length;

    if (adjacent[i] === null) {
      if (adjacent[next] === null) count++;
    } else {
      // both are not null
      if (adjacent[next]) {
        // check diagonal
        var diagonal;
        switch (i) {
          case 0:
            // N E
            diagonal = grid[point.x - 1][point.y + 1];
            break;
          case 1:
            // E S
            diagonal = grid[point.x + 1][point.y + 1];
            break;
          case 2:
            // S W
            diagonal = grid[point.x + 1][point.y - 1];
            break;
          case 3:
            // W N
            diagonal = grid[point.x - 1][point.y - 1];
            break;
          default:
            throw 'BAD';
        }
        if (diagonal.label !== point.label) count++;
      }
    }
  }
  return count;
}

// returns an array of all adjacent spaces
// always in NESW order

var directions = ['n', 'e', 's', 'w'];

function getAdjacent(point) {
  var result = [];

  // get the 4 adjacent coordinates
  for (var dir of directions) {
    var adj = getDirection({ x: point.x, y: point.y }, dir);

    // if the coordinates are within the map
    if (isInsideMap(adj)) {
      var test = grid[adj.x][adj.y];

      // adjacent if label is the same and not already visited
      if (test.label == point.label) {
        point.connectedDirs.add(dir);
        result.push(test);
      } else {
        result.push(null);
      }
    } else {
      result.push(null);
    }
  }

  return result;
}

// returns the coordinates in the given direction
function getDirection(coords, dir) {
  switch (dir) {
    case 'n':
      return { x: coords.x - 1, y: coords.y };
    case 'e':
      return { x: coords.x, y: coords.y + 1 };
    case 's':
      return { x: coords.x + 1, y: coords.y };
    case 'w':
      return { x: coords.x, y: coords.y - 1 };
    default:
      throw 'BAD';
  }
}

function isInsideMap(point) {
  return (
    point.x >= 0 &&
    point.x < grid.length &&
    point.y >= 0 &&
    point.y < grid.length
  );
}
