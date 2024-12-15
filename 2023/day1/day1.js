// open file

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day1_input.txt'),
    output: process.stdout,
    terminal: false
});

// process lines

var total = 0;

file.on('line', (line) => {

	// loop over line, find first and last digit

	console.log(line);

	var lineValue = getLineValue(line);

	total += lineValue;

	console.log('current total is: '+total);

});

file.on('close', () => { console.log('final total is: '+total); });



function getLineValue(line) {

	var lineTotal = 0;
	var firstDigit='', lastDigit='';

	for (var c of line) {


		if (/\d/.test(c)) {

			if (firstDigit == '') { // this is first digit found, set first digit

				firstDigit = c;
			}

			lastDigit = c; // always set last digit
		}
	}

	console.log('firstDigit: '+firstDigit);
	console.log('lastDigit: '+lastDigit);

	var valueString = firstDigit + lastDigit;

	return +valueString;

}