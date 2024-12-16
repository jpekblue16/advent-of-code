// find all mul(X,Y) instances
// perform multiplication and sum

//const INPUT = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

var INPUT = "";

const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day3_input.txt'),
    output: process.stdout,
    terminal: false
});

file.on('line',(line) => INPUT += line);

file.on('close', () => {
    var mulRegex = /do\(\)|don\'t\(\)|(mul\([0-9]+,[0-9]+\))/g;
    var numRegex = /[0-9]+/g;
    
    var muls = Array.from(INPUT.matchAll(mulRegex),(v) => v[0]);
    
    var total = 0;

    var enabled = true;
    
    for (var mul of muls) {

        if (mul == 'do\(\)') enabled = true;
        else if (mul == 'don\'t\(\)') enabled = false;
        else {
            var operands = Array.from(mul.matchAll(numRegex),(v) => parseInt(v[0]));

            if(enabled) total += operands[0] * operands[1];
        }
    }
    
    console.log(total);
})


