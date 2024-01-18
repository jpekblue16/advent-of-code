const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day6_input_test.txt'),
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
        var raceTimes = line.split(/\s+/).map(Number);
        raceTimes.shift();
        console.log(raceTimes);
        raceTimes.forEach((x) => { races.push({time:x}); });
        timeRead = true;
    } else {
        var distances = line.split(/\s+/).map(Number);
        distances.shift();
        console.log(distances);
        distances.forEach((x,i) => { races[i].distance = x; });
    }
});

file.on('close',() => {
    console.log(races);

    var total = 1;

    // process each race, finding number of winning times
    for (var race = 0; race < races.length; ++race) {
        var time = races[race].time;
        var distance = races[race].distance;

        var solutions = getWinningTimes(time,distance);
        total *= solutions;
    }

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

    /*
    // brute force solution
    var maxHeldTime = Math.ceil(time / 2); // midpoint will always be highest distance, must pass goal distance (otherwise solutions is 0 and answer is negated)

    var solutions = 0;
    var distanceTraveled = (time * timeHeld) - (timeHeld * timeHeld);

    while(timeHeld > 0 && distanceTraveled > distance) {
        //console.log(`total time: ${time}, time held: ${timeHeld}, distance traveled: ${distanceTraveled}`);
        ++solutions;
        --timeHeld;
        distanceTraveled = (time * timeHeld) - (timeHeld * timeHeld);
    }

    // if x is the lowest winning time held, total time - x is the highest
    // solutions is even -> even # of solutions
    // solutions is odd -> odd # of solutions

    if (time % 2 != 0) { return (solutions-1)*2; } 
    else { return  solutions * 2 - 1};
    */
}