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

    if (checkSafe(values)) {
        total++;
        return;
    }

    for (var skip in values) {
        // skip value at index i
        if (checkSafe(values,skip)) {
            total++;
            return;
        }
    }
})

file.on('close', () => {
    console.log(total);
});

function checkSafe(values, skip) {

    checkArray = JSON.parse(JSON.stringify(values));

    if (skip) checkArray.splice(skip,1);

    var isSafe = true;
    var diffSign = 0;

    for (var i = 0; i < checkArray.length-1; ++i) {

        var diff = checkArray[i] - checkArray[i+1];

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

    return isSafe;
}

/*
file.on('line', (line) => {
    var values = line.split(' ');

    var isSafe = true;
    var fault = false;
    var diffSign = 0;

    for (var i = 0, j = 0;;) {

        j++;
        if (j == values.length) break;

        var diff = values[i] - values[j];

        // multiply diff and inc/dec indicator, if negative, signs are different and line is unsafe
        if (diffSign * diff < 0) {
            if (fault) {
                isSafe = false;
                break;
            }
            fault = true;
            continue;
        } else {
            diffSign = (diff < 0) ? -1 : 1;
        }

        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            if (fault) {
                isSafe = false;
                break;
            }
            fault = true;
            continue;
        }

        i=j;
        
    }

    if (isSafe) total++;
});
*/