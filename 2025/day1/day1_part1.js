const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day1_input.txt'),
  output: process.stdout,
  terminal: false,
});

file.on('line', (line) => {});

file.on('close', () => {});
