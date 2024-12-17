// read in boolean grid, note position of obstacles and guard
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day6_input.txt'),
  output: process.stdout,
  terminal: false,
});

/*
  find all points where placing an obstacle creates a loop

  as you follow the path, check if parallel to any already found obstacles in the next direction
    if you have visited the space directly in front of that obstacle
      going the same direction as the next direction
        a loop is created
*/

// holds map of floor, empty spaces will be boolean, obstacles/guard will still be symbols
var grid = [];
var start = { x: 0, y: 0 }; // tracks guard starting location

// track visited obstacles by x and y positions
var obstaclesByX = new Map();
var obstaclesByY = new Map();

var directions = ['n', 'e', 's', 'w'];

var lineCount = 0; // will be used as y coordinate of grid

file.on('line', (line) => {
  // map line to grid, replace . with false
  var mapLine = Array.from(line.split(''), (v, i) => {
    switch (v) {
      case '^': // found starting pos, store it and put in map
        start = { x: i, y: lineCount };
        return { visited: true, going: new Set(['n']) }; // store space as visited, going north
      case '#': // put obstacle in map
        // store visited obstacle, keep obstacles sorted along the corresponding axis
        var point = { x: i, y: lineCount };
        if (obstaclesByX.has(i)) {
          obstaclesByX.get(i).push(point);
        } else {
          obstaclesByX.set(i, [point]);
        }

        if (obstaclesByY.has(lineCount)) {
          obstaclesByY.get(lineCount).push(point);
        } else {
          obstaclesByY.set(lineCount, [point]);
        }
        return v;
      default: // '.'
        return { visited: false, going: new Set() }; // store a boolean if the space has been visited, and an array of which direction it was visited in
    }
  });

  // add line to grid
  grid.push(mapLine);
  lineCount++;
});

// follow guard's path, marking newly seen empty spaces
file.on('close', () => {
  var total = 0; // total spaces visited, including start location

  // track path until guard reaches edge of map
  var facing = 'n'; // guard starts facing north
  var curPoint = { x: start.x, y: start.y };
  var curSpace = getSpace(curPoint);

  // maintain same pathing as part 1, check for loops created along the path
  while (1) {
    var targetPoint = getNext(curPoint, facing);

    // check if target is outside map
    if (isOutsideMap(targetPoint, grid[0].length - 1, grid.length - 1)) break;

    // check the target point
    // if obstacle, turn
    var targetSpace = getSpace(targetPoint);

    if (targetSpace === '#') {
      // obstacle
      facing = getNextDir(facing); // get next direction
      curSpace.going.add(facing); // 'visit' current space in new direction
      continue;
    }

    // move to the target
    curPoint = targetPoint;
    curSpace = getSpace(curPoint);

    curSpace.visited = true;
    curSpace.going.add(facing);

    // check for any obstacles parallel to the current point in the next direction
    // next = n: y < curY; e: x > curX; s: y > curY; w: x < curX
    var next = getNextDir(facing);

    // find the closest obstacle in the next direction
    var closestObstacle =
      next == 'n' || next == 's'
        ? getClosestObstacle(curPoint, next, obstaclesByX)
        : getClosestObstacle(curPoint, next, obstaclesByY);

    if (closestObstacle) {
      // if the potential hit point of that obstacle has already been visited in the next direction, a loop is created
      var hitPoint = getHitPoint(closestObstacle, next);
      if (!isOutsideMap(hitPoint) && visitedInDirection(hitPoint, next)) {
        total++;
        console.log(total);
      }
    }
  }

  console.log(total);
});

// returns the space at the given position
function getSpace(pos) {
  try {
    return grid[pos.y][pos.x];
  } catch (e) {
    console.log(e);
  }
}

function getNext(point, facing) {
  switch (facing) {
    case 'n':
      return { x: point.x, y: point.y - 1 };
    case 'e':
      return { x: point.x + 1, y: point.y };
    case 's':
      return { x: point.x, y: point.y + 1 };
    case 'w':
      return { x: point.x - 1, y: point.y };
    default:
      throw 'BAD';
  }
}

function isOutsideMap(point) {
  return (
    point.x < 0 ||
    point.x >= grid.length ||
    point.y < 0 ||
    point.y >= grid.length
  );
}

function getNextDir(dir) {
  return directions[(directions.indexOf(dir) + 1) % directions.length];
}

// returns the point at which the obstacle would be hit, moving in the given direction
function getHitPoint(obstacle, dir) {
  switch (dir) {
    case 'n':
      return { x: obstacle.x, y: obstacle.y + 1 };
    case 'e':
      return { x: obstacle.x - 1, y: obstacle.y };
    case 's':
      return { x: obstacle.x, y: obstacle.y - 1 };
    case 'w':
      return { x: obstacle.x + 1, y: obstacle.y };
    default:
      throw 'BAD';
  }
}

// has the point at the given position been visited?
// pos should be object with x and y: { x:xpos, y:ypos }
function visitedInDirection(pos, dir) {
  try {
    return grid[pos.y][pos.x].going.has(dir);
  } catch (e) {
    console.log(e);
  }
}

function getClosestObstacle(pos, dir, obstacles) {
  var mode = dir == 'n' || dir == 's' ? 'y' : 'x';
  var perp = mode == 'y' ? 'x' : 'y'; // access map via opposite mode

  if (obstacles.has(pos[perp])) {
    var parallelObstacles = obstacles.get(pos[perp]);
    var closest =
      dir == 'n' || dir == 'w'
        ? parallelObstacles[0]
        : parallelObstacles[parallelObstacles.length - 1];
    for (var o of parallelObstacles) {
      switch (dir) {
        // for N and W, closest obstacle is lower in the appropriate axis
        case 'n':
        case 'w':
          if (o[mode] > pos[mode]) break;
          else if (closest[mode] < pos[mode]) closest = o;
          break;
        // for E and S, closest will be greater on the appropriate axis
        case 'e':
        case 's':
          if (o[mode] > pos[mode]) {
            return o;
            break;
          }
          break;
        default:
          throw 'BAD';
      }
    }

    // make sure closest is in the right direction
    if ((dir == 'n' || dir == 'w') && closest[mode] < pos[mode]) return closest;
    else if ((dir == 'e' || dir == 's') && closest[mode] > pos[mode])
      return closest;
    else return;
  } else {
    return;
  }
}
