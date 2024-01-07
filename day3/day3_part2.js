// find the sum of all numbers that are adjacent to a symbol (except '.')

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day3_input.txt'),
    output: process.stdout,
    terminal: false
});

// gear needs exactly 2 part numbers

// array of each number in the previous row with their start/end positions
var prevRowNumbers = []; // { number,start,end }

// array of gears in previous row, with array of adjacent numbers
var prevRowGears = []; // { pos, numbers[] }

var total = 0;
var rowNum = 1;

file.on('line', (line) => {

    console.log(`row ${rowNum}: ${line}`);

    console.log(prevRowNumbers);
    console.log(prevRowGears);

    var newNumbers = []; // store all numbers from a row with start index-1 and end index+1
    var newGears = [];

    var inNumber = false; // tracks if currently parsing through a number
    var tempNum = ''; // holds the number being parsed
    var tempNumStart = 0;
    var adjacent = false;

    for (var i = 0; i < line.length; ++i) {

    	var c = line[i];

    	// if number is found
    	if (/\d/.test(c)) {

            // if already parsing a number
            if (inNumber) {

                // concat onto temp number
                tempNum += c;

            } 
            // new number is found
            else {
                inNumber = true;
                tempNum = c;
                tempNumStart = i;
            }

            // check if number is adjacent to a gear from the previous row
            for (var gear of prevRowGears) {
                if (gear.pos-1 <= i && i <= gear.pos+1)
            }

    	}
    	// if gear is found
    	else if (/[\*]/.test(c)) {
            console.log(`gear found at position ${i}`);

            var newGear = { pos: i, numbers: [] };

            if (inNumber) { // gear found at end of number
                newGear.numbers.push(parseInt(tempNum));
                newNumbers.push({number: parseInt(tempNum), start:tempNumStart, end: i-1});
            }

            inNumber = false;
            tempNumStart = -1;
            tempNum = '';

            adjacent = true;

    	}
    	// else reset state and finalize number if being parsed
    	else {

        }
    }

    // if in a number at the end of line, finalize and check adjacency
    if (inNumber) {

    }

    prevRowNumbers = newNumbers;
    prevRowGears = newGears;

    rowNum++;
    console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });