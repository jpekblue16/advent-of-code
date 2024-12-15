const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day8_input.txt'),
    output: process.stdout,
    terminal: false
});

var nodeMap = new Map(); // contains each node with their right and left connections

const nodeRegex = /([A-Z])\w+/g;

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

    nodeMap.set(nodes[0],{'L':nodes[1],'R':nodes[2]});

});

file.on('close',() => {
    console.log(nodeMap);
    console.log(directions);

    var total = 0;

    var curNode = 'AAA'; // track the current node
    var curStep = 0; // track the direction string

    while (curNode != 'ZZZ') {

        console.log(`will move: ${directions[curStep]} to node: ${nodeMap.get(curNode)[directions[curStep]]}`);

        curNode = nodeMap.get(curNode)[directions[curStep]];
        total++;

        curStep = (curStep == directions.length - 1) ? 0 : curStep+1;
    }

    console.log(total);

});