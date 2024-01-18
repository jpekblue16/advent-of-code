const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day6_input.txt'),
    output: process.stdout,
    terminal: false
});

var timeRead = false;

// will have the same lengths
var races = {};

file.on('line', (line) => {
    // read the two input lines
    if(!timeRead) {
        // split the races into each game
        var raceTimes = line.split(/\s+/).map(Number);
        raceTimes.shift();
        races.time = parseInt(raceTimes.join(''));
        timeRead = true;
    } else {
        var distances = line.split(/\s+/).map(Number);
        distances.shift();
        console.log(distances);
        races.distance = parseInt(distances.join(''));
    }
});

file.on('close',() => {
    console.log(races);

    var total = getWinningTimes(races.time,races.distance);

    console.log('total is '+total);
});

// want to find values where total time * time held - time held*time held > goal distance
// a = total time; b = time held; c = goal distance
// ab - b^2 > c
function getWinningTimes(time,distance) {
    
    //use quadratic formula to find point at which time held matches goal distance
    // x^2 - time*x + distance = 0 -> ((time) - sqrt(time^2 - 4*1*distance)) / 2

    var lowestHeldTime = Math.floor((time - Math.sqrt(time*time - 4*distance)) / 2)+1; // highest held time is time - lowest

    return (time - lowestHeldTime) - lowestHeldTime + 1;
}