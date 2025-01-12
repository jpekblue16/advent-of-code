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
// give each space an id to determine which spaces are taken along the path
var maze = [];
var directions = ['n', 'e', 's', 'w'];
var id = 0;
file.on('line', (line) => {
  maze.push(
    Array.from(line.split(''), (v) => {
      return {
        id: id++,
        value: v,
        leastCost: [Infinity, Infinity, Infinity, Infinity],
      };
    })
  );
});

// search through maze and store lowest cost to reach each traveled space
file.on('close', () => {
  // starting point will always be lower left
  var startLoc = new vec(1, maze.length - 2);
  var startDir = 'e';

  // track lowest score found where end is reached
  var minScore = 92432;

  var searchQueue = [
    {
      loc: startLoc,
      facing: startDir,
      justTurned: false,
      score: 0,
      path: new Set([getMazeSpace(startLoc).id]),
    },
  ];

  var pathsToEnd = [];

  while (searchQueue.length > 0) {
    //console.log(searchQueue.length);
    var cur = searchQueue.pop();
    var curScore = cur.score;
    var curSpace = getMazeSpace(cur.loc);

    if (curScore < curSpace.leastCost[directions.indexOf(cur.facing)])
      curSpace.leastCost[directions.indexOf(cur.facing)] = curScore;

    if (curScore > minScore) continue;

    // check space in current direction
    var next = getNext(cur.loc, cur.facing);
    var nextSpace = getMazeSpace(next);

    // if end is reached, save the path and its score
    if (nextSpace.value == 'E') {
      var completePath = cur.path;
      completePath.add(nextSpace.id);
      pathsToEnd.push({ path: completePath, score: curScore + 1 });

      console.log(`path found with score: ${curScore + 1}`);
      console.log(completePath);
      continue;
    } else if (nextSpace.value == '.') {
      if (
        !cur.path.has(nextSpace.id) &&
        curScore + 1 <= nextSpace.leastCost[directions.indexOf(cur.facing)]
      ) {
        var newPath = new Set(cur.path);
        newPath.add(nextSpace.id);
        searchQueue.push({
          loc: next,
          facing: cur.facing,
          justTurned: false,
          score: curScore + 1,
          path: newPath,
        });
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
            path: new Set(cur.path), // no new spaces added to path
          });
        }
      }
    }
  }

  // for all paths with score == min score, add their spaces to a final set
  var finalSet = [];
  for (var path of pathsToEnd) {
    finalSet.push(...path.path);
  }
  var merge = new Set(finalSet);

  console.log(merge.size);
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

// returns the directions adjacent to the given direction
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
