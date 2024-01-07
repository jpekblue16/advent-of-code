
const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day4_input.txt'),
    output: process.stdout,
    terminal: false
});

var total = 0;

var numCopies = {};
var curCard = 1;

file.on('line', (line) => {

    // loop over line, find first and last digit

    //console.log(line);

    (numCopies.hasOwnProperty(curCard)) ? numCopies[curCard]++ : numCopies[curCard] = 1;
    console.log(numCopies[curCard]);

    console.log('card '+curCard+' has '+numCopies[curCard]+' copies');

    var lineValue = getLineValue(line);

    console.log('card '+curCard+' has '+lineValue+' matches');

    for (var card = curCard + 1; card <= curCard + lineValue; card++) {
        (numCopies.hasOwnProperty(card)) ? numCopies[card] += numCopies[curCard] : numCopies[card] = numCopies[curCard];
    }

    total += numCopies[curCard];
    ++curCard;

    console.log(numCopies);

    console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });

function getLineValue(line) {
    // 

    var matches = 0;

    var values = line.substring(10);

    // split on |
    var split = values.split('|');

    // build set of winning numbers
    var winningNums = new Set(split[0].split(' '));

    // go through numbers you have and check set
    var haveNums = split[1].split(' ');

    // find number of matches on the card
    for (var num of haveNums) {
        if (num && winningNums.has(num)) {
            matches++;
        }
    }

    return matches;
}