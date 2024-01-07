
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day4_part1_input.txt'),
    output: process.stdout,
    terminal: false
});

var total = 0;

file.on('line', (line) => {

    // loop over line, find first and last digit

    //console.log(line);

    var lineValue = getLineValue(line);

    total += lineValue;

    console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });

function getLineValue(line) {
    // 

    var score = 0;

    var values = line.substring(10);

    // split on |
    var split = values.split('|');

    // build set of winning numbers
    var winningNums = new Set(split[0].split(' '));

    // go through numbers you have and check set
    var haveNums = split[1].split(' ');

    // add 1 / double total for each match
    for (var num of haveNums) {
        if (num && winningNums.has(num)) {
            (score == 0) ? score++ : score *= 2;
        }
    }

    return score;
}