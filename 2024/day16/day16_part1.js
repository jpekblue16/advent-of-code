const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day16_input.txt'),
  output: process.stdout,
  terminal: false,
});

// create class for easy grid traversal
class vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(addVec) {
    try {
      return new vec(this.x + addVec.x, this.y + addVec.y);
    } catch (e) {
      throw e;
    }
  }

  neg() {
    return new vec(-this.x, -this.y);
  }
}

// find the lowest cost path through the maze
// move forward = 1 point, turn = 1000 points
// start bottom left, end top right

// read in maze input
var maze = [];
file.on('line', (line) => {
  maze.push(
    Array.from(line.split(''), (v) => {
      return { value: v, leastCost: Infinity };
    })
  );
});

// search through maze and store lowest cost to reach each traveled space
file.on('close', () => {
  // starting point will always be lower left
  var startLoc = new vec(1, maze.length - 2);
  var startDir = 'e';

  // track lowest score found where end is reached
  var minScore = Infinity;

  var searchQueue = [
    { loc: startLoc, facing: startDir, justTurned: false, score: 0 },
  ];
  while (searchQueue.length > 0) {
    var cur = searchQueue.shift();
    var curScore = cur.score;

    // check space in current direction
    var next = getNext(cur.loc, cur.facing);
    var nextSpace = getMazeSpace(next);

    // if end, set minScore if score+1 is lower
    if (nextSpace.value == 'E' && curScore + 1 < minScore) {
      minScore = curScore + 1;
      continue;
    } else if (nextSpace.value == '.') {
      // if open and target space score is >= score+1, add to queue with score+1
      if (curScore + 1 < nextSpace.leastCost) {
        searchQueue.push({
          loc: next,
          facing: cur.facing,
          justTurned: false,
          score: curScore + 1,
        });
        // set least cost for the next space
        nextSpace.leastCost = curScore + 1;
      }
    }

    // if you didn't turn on the previous move, check for turn
    if (!cur.justTurned) {
      // check L/R rotations
      var adj = getAdjacentDirections(cur.facing);
      // if space in that direction is open, add to queue with new direction and score+1000
      for (var d of adj) {
        var target = getNext(cur.loc, d);

        if (getMazeSpace(target).value != '#') {
          searchQueue.push({
            loc: cur.loc,
            facing: d,
            justTurned: true,
            score: curScore + 1000,
          });
        }
      }
    }
  }

  console.log(minScore);
});

// returns the maze space at the given position
function getMazeSpace(pos) {
  return maze[pos.y][pos.x];
}

// gets the coordinates for the next space in the given direction
function getNext(pos, dir) {
  return pos.add(getDir(dir));
}

// returns the unit vector for the given direction
function getDir(dir) {
  switch (dir) {
    case 'n':
      return new vec(0, -1);
    case 'e':
      return new vec(1, 0);
    case 's':
      return new vec(0, 1);
    case 'w':
      return new vec(-1, 0);
    default:
      throw 'BAD';
  }
}

function getAdjacentDirections(dir) {
  switch (dir) {
    case 'n':
    case 's':
      return ['e', 'w'];
    case 'w':
    case 'e':
      return ['n', 's'];
    default:
      throw 'BAD ADJACENT DIRECTION';
  }
}
