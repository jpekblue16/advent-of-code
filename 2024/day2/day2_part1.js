const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day2_input.txt'),
    output: process.stdout,
    terminal: false
});

var total = 0;

file.on('line', (line) => {
    var values = line.split(' ');

    var isSafe = true;
    var diffSign = 0;

    for (var i = 0; i < values.length-1; ++i) {

        var diff = values[i] - values[i+1];

        if (diffSign * diff < 0) {
            // multiply diff and inc/dec indicator, if negative, signs are different and line is unsafe
            isSafe = false;
            break;
        } else {
            diffSign = (diff < 0) ? -1 : 1;
        }

        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            isSafe = false;
            break;
        }
    }

    if (isSafe) total++;
});

file.on('close', () => {
    console.log(total);
});