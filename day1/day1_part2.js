// open file

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day1_input.txt'),
    output: process.stdout,
    terminal: false
});

const NUMBERS = ['zero','one','two','three','four','five','six','seven','eight','nine'];

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
	var firstDigit='', lastDigit=''; // track the first and last digit of the entire line

	//loop over the line

	for (var i = 0; i < line.length; ++i) { // lol, switched to for loop instead of for-in so i can add the length of the number word to the iterator value

		var c = line[i];
		
		if (/\d/.test(c)) { // digit found

			if (firstDigit == '') {
				firstDigit = c;
			}
			lastDigit = c;
			++i;

		} else { // letter is found

			var numFound = false;

			for (var number of NUMBERS) { // check for each number

				var numLength = number.length;

				// need to check if the number would be longer than the end of the line
				if (numLength > line.length) continue;

				if (line.substring(i,i+number.length) == number) { // number word is found!!!
					numFound = true;

					if (firstDigit == '') {
						firstDigit = NUMBERS.indexOf(number)+'';
					}
					lastDigit = NUMBERS.indexOf(number)+'';

					console.log('number is: '+lastDigit);

					break;
				}

			}

		}
	}



	var valueString = firstDigit + lastDigit;

	console.log('adding '+valueString+' to the total');

	return +valueString;

}