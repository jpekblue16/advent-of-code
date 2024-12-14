// sort both lists
// read through each and sum distance

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day1_input.txt'),
    output: process.stdout,
    terminal: false
});

var list1 = [];

var list2 = new Map();

var total = 0;

file.on('line', (line) => {

	// loop over line, find first and last digit

	console.log(line);

	var splitLine = line.split('   ');

  list1.push(splitLine[0]);
  
  list2.has(splitLine[1]) ? list2.get(splitLine[1]).val++ : list2.set(splitLine[1],{val:1});

});

file.on('close', () => {

  for (var i of list1) {
    total += i * (list2.has(i) ? list2.get(i).val : 0);
  }

  console.log('final total is: '+total); 
});