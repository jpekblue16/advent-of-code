const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('day9_input.txt'),
  output: process.stdout,
  terminal: false,
});

// fill in gaps with furthest right number
// PART 2 -- can only move full file into an empty space that fits

/*
    numbers describe in alternating positions:
        - number of consecutive digits, incrementing by 1 each time (start at 0)
        - number of consecutive blank spaces

    e.g.
        12345 -> 0..111....22222
*/

// track the index and size of each empty space
var emptySpaces = [];

// input file is only 1 line
file.on('line', (line) => {
  //console.log(line);

  // generate data array
  var dataArray = generateDataArray(line);

  // console.log(dataArray.join(''));

  // create processed array
  // processed array will have file IDs in order as integers
  processData(dataArray);

  // console.log(dataArray.join(''));

  //calculate checksum
  // skip over any blanks, otherwise add product to sum
  var total = dataArray.reduce(
    (total, v, i) => (v != '.' ? total + v * i : total),
    0
  );

  console.log(total);
});

// creates the data array based on the input string
function generateDataArray(input) {
  var result = [];
  var insertDigits = true;
  var counter = 0;
  var index = 0; // track index for blank spaces

  for (var i = 0; i < input.length; ++i) {
    var count = parseInt(input.at(i));

    if (count == 0 && insertDigits) console.log(' empty file ');

    var data = Array(count).fill(insertDigits ? counter++ : '.');

    result.push(...data);

    // if empty, add to space array
    if (!insertDigits && count > 0) {
      // check for previous consecutive empty space
      var prevSpace = emptySpaces.at(-1);
      if (emptySpaces.length > 0 && prevSpace.index + prevSpace.size == index) {
        prevSpace.size += count;
      } else {
        emptySpaces.push({ index: index, size: count });
      }
    }

    index += count;
    insertDigits = !insertDigits;
  }

  return result;
}

// move files starting from the largest id
function processData(data) {
  // starting at the last file
  var index = data.length - 1;
  var id = data.at(index);

  // try to move every id to furthest left spot it fits in
  while (id > 0) {
    // find length of block
    var fileSize = 1;
    while (data.at(index - 1) == id) {
      index--;
      fileSize++;
    }

    // find first empty spot that fits
    // loop over empty space array and check size
    var space = undefined;
    for (var i of emptySpaces) {
      // only look at empty space to the left of the file
      if (i.index > index) break;

      if (i.size > 0 && fileSize <= i.size) {
        space = i;
        break;
      }
    }

    // fill space with file id and replace file id spaces with blanks
    if (space) {
      // for each character of file, swap blank space and id
      for (var i = 0; i < fileSize; ++i) {
        data[space.index + i] = id;
        data[index + i] = '.';
      }

      // modify space filled
      space.size -= fileSize;
      space.index += fileSize;
    }

    //console.log(data.join(''));

    // find next file
    id--;
    while (data.at(index) !== id) index--;
  }
}
