// find the sum of all numbers that are adjacent to a symbol (except '.')

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day3_input.txt'),
    output: process.stdout,
    terminal: false
});

// gear needs exactly 2 part numbers

var rows = [];


file.on('line', (line) => {

    // read file and build matrix

    rows.push(line.split(''));

});

file.on('close', () => {
    var total = 0;

    // process array and find gears with 2 adjacent part #s
    for (var row = 0; row < rows.length; ++row) {
        for (var col = 0; col < rows[row].length; ++col) {
            // if gear, check for numbers
            var symbol = rows[row][col];
            if (/\*/.test(symbol)) {
                console.log(`* found at ${row}, ${col}`);
                // look for numbers in surrounding tiles
                var parts = findAdjacentNumbers(row,col);

                // only count gears with 2 numbers
                if (parts.length == 2) {
                    total += parseInt(parts[0]) * parseInt(parts[1]);
                }
            }
        }
    }

    console.log("total value is "+total);
});

/*
    1 2 3
    4 * 5
    6 7 8
*/

// row, col are the index of the gear (*)
function findAdjacentNumbers(row,col) {

    var adjacentNumbers = [];

    // account for * in first or last row (may not appear in the input but account for it anyway)
    var rowStart = (row > 0) ? row-1 : row;
    var rowEnd = (row < rows.length - 1) ? row+1 : row;

    for (var curRow = rowStart; curRow <= rowEnd; ++curRow) {
        var colStart = (col>0) ? col-1 : col;
        var colEnd = (col < rows[curRow].length - 1) ? col+1 : col;

        for(var curCol = colStart; curCol <= colEnd; ++curCol) {

            var number = '';
            if (/\d/.test(rows[curRow][curCol])) {
                // number found
                number = rows[curRow][curCol];
                var numRow = curRow, numCol = curCol; // keep index of initial found number

                number = buildNumber(numRow, numCol, number);

                // if a number was found
                if (number != '') {
                    // add it to found numbers
                    adjacentNumbers.push(number);

                    // if a number was found in 1/4/6
                    if (numCol == col-1) {
                        // if next symbol is not a number, skip to 3/5/8
                        if (!/\d/.test(rows[curRow][col])) {
                            curCol++;
                        } 
                        // if next symbol is a number, already added to current number and don't need to check third position
                        // skip to next row
                        else {
                            break;
                        }
                    // else skip to next row
                    } else { 
                        break;
                    }
                }
            }

        }
    }

    return adjacentNumbers;

}

function buildNumber(row,col, number) {

    var check = col; // keep original start point
    // search backward
    while (check > 0 && /\d/.test(rows[row][check-1])) {
        number = rows[row][check-1] + number;
        check--;
    }

    // search forward
    check = col;
    while (check < rows[row].length - 1 && /\d/.test(rows[row][check+1])) {
        number = number + rows[row][check+1];
        check++;
    }

    return number;
}