// from the given input file, fund the sum of all game IDs where 12 red, 13 green, 14 blue cubes are possible

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day2_input_test.txt'),
    output: process.stdout,
    terminal: false
});

// process lines

var total = 0;

const COLORS = ["red","green","blue"];

const RED_MAX = 12,GREEN_MAX = 13, BLUE_MAX = 14;

file.on('line', (line) => {

    // loop over line, find first and last digit

    console.log(line);

    var lineValue = getLineValue(line);

    total += lineValue;

    console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });

function getLineValue(line) {
    // split line on : and ;

    var isPossible = true;

    var segments = line.split(/: |; /); // ["Game X","<pull 1 results>","<pull 2 results>","<pull 3 results>"];

    var gameId = +(segments[0].substring(5)); // will get everything after "Game " as a number
    segments.shift();

    for (var pull of segments) {
        var results = pull.split(', '); // split each pull by dice

        for (var color of results) {
            
            var splitPull = color.split(' '); // index 0 is amount, index 1 is color

            var amount = +splitPull[0];
            var color = splitPull[1];

            if (color == "red" && amount > RED_MAX) {
                isPossible = false;
            } else if (color == "green" && amount > GREEN_MAX) {
                isPossible = false;
            } else if (color == "blue" && amount > BLUE_MAX) {
                isPossible = false;
            }

            if (!isPossible) break; // if game is already impossible, stop
        }

        if (!isPossible) break; // if game is already impossible, stop

    }

    if (isPossible) {
        console.log('game is possible, adding '+gameId+' to the total');
        return gameId;
    } else {
        console.log('game is impossible');
        return 0;
    }
}