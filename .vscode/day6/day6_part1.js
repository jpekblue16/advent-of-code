const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day3_input.txt'),
    output: process.stdout,
    terminal: false
});

var timeRead = false;

// will have the same lengths
var races = [];

file.on('line', (line) => {
    // read the two input lines
    if(!timeRead) {
        // split the races into each game
        raceTimes = line.split(/\s+/).map(Number).forEach((x) => { races.push({time:x}); });
        timeRead = true;
    } else {
        distance = line.split(/s+/).map(Number).forEach((x,i) => { races[i].distance = x; });
    }
});

file.on('close',() => {
    console.log(races);

    // process each race, finding number of winning times
    for (var race = 0; race < raceTimes.length; ++race) {

    }
});