// find the sum of all numbers that are adjacent to a symbol (except '.')

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day3_input.txt'),
    output: process.stdout,
    terminal: false
});

// class Part {
// 	constructor(number, start, end) {
// 		this.number = number;
// 		this.start = start;
// 		this.end = end;
// 		this.adjacent = false;
// 	}
// }

// array of indexes adjacent to numbers {index: number}
var prevRowNumbers = new Map(); // <number, <start, end>>

// array of indexes from previous row adjacent to symbols
var prevRowSymbols = new Set();

var total = 0;
var rowNum = 1;

file.on('line', (line) => {

    console.log(`row ${rowNum}: ${line}`);

    console.log(prevRowNumbers);
    console.log(prevRowSymbols);

    var newNumbers = new Map();
    var newSymbols = new Set();

    var inNumber = false; // tracks if currently parsing through a number
    var tempNum = ''; // holds the number being parsed
    var tempNumStart = 0;
    var adjacent = false; // tracks if a currently parsed number is adjacent to a symbol

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

            // check if the index is adjacent to a symbol in the previous row
            if (prevRowSymbols.has(i)) {
                adjacent = true;
            }

    	}
    	// if symbol is found
    	else if (/[^0-9.]/.test(c)) {
            console.log(`symbol ${c} found at position ${i}`);

    		// if symbol is at the end of a number
    		if (inNumber) {

                console.log(`symbol found at end of number, adding ${tempNum} to total`);
    			// tempNum is the final value, add to total
    			total+= parseInt(tempNum);
    			
    			// no need to add number to map
    		}

    		inNumber = false;
    		tempNumStart = -1;
    		tempNum = '';

    		// add i-1,i,i+1 to newSymbols to designate indexes on the next row that are adjacent to symbols
    		// dont need to care about adding -1 or line.length+1
    		newSymbols.add(i-1).add(i).add(i+1);

    		// next character will be adjacent to a symbol
    		adjacent = true;
    		
    		// check if symbol is adjacent to any number from the previous row
    		for (var num of prevRowNumbers.keys()) {

    			var startEnd = prevRowNumbers.get(num); // startEnd is an array of 2 numbers

    			// if symbol index is between start and end of number, add number and delete entry
    			if (startEnd[0] <= i && startEnd[1] >= i) {

                    console.log(`prev row number ${num} is adjacent, adding to total`)

    				total += num;
    				prevRowNumbers.delete(num); // delete from previous row map so other symbols won't double count the number
    			}

    			// want to continue looping in case symbol is adjacent to multiple numbers
    		}

    	}
    	// else reset state and finalize number if being parsed
    	else {

    		// if currently parsing number, finalize
    		if (inNumber) {

    			// if already adjacent, add to total
    			if (adjacent) {
                    console.log(`number ${parseInt(tempNum)} is adjacent to a symbol, adding to total`);
    				total += parseInt(tempNum);
    			}
    			// not adjacent, add number to the map
    			// start and end should include 1 extra index on each side of number
    			else {
                    console.log(`number ${parseInt(tempNum)} not adjacent, adding to map with start/end positions: ${tempNumStart-1} / ${i}`);
    				newNumbers.set(parseInt(tempNum),new Array(tempNumStart-1,i));
    			}
    		}

            inNumber = false;
    		adjacent = false;
    		tempNum = '';
    		tempNumStart = -1;

    	}
    }

    // if in a number at the end of line, finalize and check adjacency
    if (inNumber) {

        // if already adjacent, add to total
        if (adjacent) {
            console.log('number is already adjacent to a symbol, adding to total');
            total += parseInt(tempNum);
        }
        // not adjacent, add number to the map
        // start and end should include 1 extra index on each side of number
        else {
            console.log(`number not adjacent, adding to map with start/end positions: ${tempNumStart} / ${i}`);
            newNumbers.set(parseInt(tempNum),new Array(tempNumStart-1,i));
        }
    }

    prevRowNumbers = newNumbers;
    prevRowSymbols = newSymbols;

    rowNum++;
    console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });