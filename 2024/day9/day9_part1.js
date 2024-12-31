const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day9_input.txt'),
  output: process.stdout,
  terminal: false,
});

// fill in gaps with furthest right number

/*
    numbers describe in alternating positions:
        - number of consecutive digits, incrementing by 1 each time (start at 0)
        - number of consecutive blank spaces

    e.g.
        12345 -> 0..111....22222
*/

// input file is only 1 line
file.on('line', (line) => {
  //console.log(line);

  // generate data array
  var dataArray = generateDataArray(line);

  //console.log(dataArray.join(''));

  //calculate checksum (want to practice using reduce)
  var total = 0;
  var i = 0,
    furthestRight = -1;
  while (i < dataArray.length + furthestRight) {
    while (dataArray.at(furthestRight) == '.') furthestRight--;

    // if the current item is blank, use the furthest right value
    total +=
      i *
      parseInt(
        dataArray[i] == '.' ? dataArray.at(furthestRight--) : dataArray[i]
      );

    i++;
  }

  console.log(total);
});

// creates the data string based on the input string
function generateDataArray(input) {
  var result = [];
  var insertDigits = true;
  var counter = 0;

  for (var i = 0; i < input.length; ++i) {
    var count = parseInt(input.at(i));

    var data = Array(count).fill(insertDigits ? '' + counter++ : '.');

    result.push(...data);

    //counter = (counter + 1) % 10;
    insertDigits = !insertDigits;
  }

  return result;
}
