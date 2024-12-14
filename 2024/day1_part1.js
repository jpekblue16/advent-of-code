// sort both lists
// read through each and sum distance

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day1_input.txt'),
    output: process.stdout,
    terminal: false
});

var list1 = [], list2 = [];

var total = 0;

file.on('line', (line) => {

	// loop over line, find first and last digit

	console.log(line);

	var splitLine = line.split('   ');

  list1.push(splitLine[0]);
  list2.push(splitLine[1]);

});

file.on('close', () => {

  list1.sort();
  list2.sort();

  for (var i in list1) {
    console.log(``)
    total += difference(list1[i],list2[i]);
  }

  console.log('final total is: '+total); 
});

function difference(a,b) {
  if (a > b) return a - b;
  return b - a;
}