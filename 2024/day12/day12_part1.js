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

        total += plot.area * plot.perimeter;
      }
    }
  }

  console.log(total);
});

// starting from the given point, find all connected spaces with a matching labels
function getPlot(start) {
  // use a breadth first search to find connected nodes
  var queue = [];
  queue.push(start);

  // track the plot's area and perimeter
  // start with 1 as perimeter, then add up to 3 for each non-adjacent edge
  var plot = { area: 0, perimeter: 0 };

  while (queue.length > 0) {
    var cur = queue.pop();

    // if node is already visited, skip it
    if (cur.visited) continue;

    // visit current node and add to plot
    cur.visited = true;
    plot.area++;

    // find all adjacent spaces
    var adjacent = getAdjacent(cur);

    // for any directions that are not adjacent, add to perimeter
    plot.perimeter += 4 - adjacent.length;

    queue.push(...adjacent);
  }

  return plot;
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
        result.push(test);
      }
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
