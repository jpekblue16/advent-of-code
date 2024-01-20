const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day8_input.txt'),
    output: process.stdout,
    terminal: false
});

var nodeMap = new Map(); // contains each node with their right and left connections
var startNodes = [];

const nodeRegex = /([0-9A-Z])\w+/g;

var linesRead = 0;
var directions = '';

file.on('line', (line) => {
    // read line 0, skip 1, then read all nodes
    if (linesRead == 0) {
        directions = line;
        ++linesRead;
        return;
    }

    if (!line) return; // skip blank line

    // read lines in format AAA = (BBB, CCC)
    var nodes = line.match(nodeRegex);

    var node = {'L':nodes[1],'R':nodes[2]};
    if (nodes[0][2] == 'A') startNodes.push(nodes[0]); // track all nodes that end in A to start from

    nodeMap.set(nodes[0],node);

});

file.on('close',() => {
    console.log(startNodes);

    var loopLengths = [];

    // for each start node, find the end point and check for a loop
    for (var node in startNodes) {

        var stepsToFinish = 0, start = startNodes[node], curNode = start, curStep = 0;

        // find distance to end point
        var foundZ = false;
        while(!foundZ) {
            curNode = nodeMap.get(curNode)[directions[curStep]];

            stepsToFinish++;

            if (curNode[2] == 'Z') foundZ = true;
            curStep = getNextStep(curStep);
        }

        console.log(`took ${stepsToFinish} steps to get from ${start} to ${curNode}`);
        loopLengths.push(stepsToFinish);
        console.log(`position in directions: ${curStep}`);



    }

    // all start paths reach end point at end of direction string
    // (ignoring possibility of multiple end point)
    // find common multiple of all path lengths
        
    
    var result = loopLengths[0];
    for (var i = 1; i < loopLengths.length; ++i) { // start at second loop value
        result = lcm(result,loopLengths[i]);
        console.log(`lcm of ${result} and ${loopLengths[i]} is ${result}`);
    }

    console.log(result);

});

function getNextStep(curStep) { return (curStep == directions.length - 1) ? 0 : curStep+1; }

function lcm(a,b) {
    // LCM(a,b) = a * (b / GCD(a,b)) - a & b will always be positive

    return a * (b / gcd(Math.max(a,b),Math.min(a,b)));
}

function gcd(a,b) {
    if (b == 0) return a;

    var result = gcd(b,a%b);

    return result;
}