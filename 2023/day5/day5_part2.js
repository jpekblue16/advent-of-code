const fs = require('node:fs');
const { sourceMapsEnabled } = require('node:process');
const readline = require('readline');

// step 0: read seeds
// step 1: seed to soil map
// step 2: soil to fertilizer map
// step 3: fertilizer to water map
// step 4: water to light map
// step 5: light to temperature map
// step 6: temperature to humidity map
// step 7: humidity to location map
var steps = 0;

var seeds = [];

var maps = [
    [], // seed to soil
    [], // soil to fertilizer
    [], // fertilizer to water
    [], // water to light
    [], // light to temp
    [], // temp to humidity
    []  // humidity to location
]

const file = readline.createInterface({
    input: fs.createReadStream('day5_input.txt'),
    output: process.stdout,
    terminal: false
});

file.on('line', (line) => {

    if (!line) steps = -1; // if blank line, check for next step

    // read through file and build objects
    switch(steps) {
        case 0:
            // read seeds
            seeds = line.substring(line.indexOf(' ')+1).split(' ').map(Number);
            console.log(seeds);
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            maps[steps-1].push({
                sourceStart: values[1],
                sourceEnd: values[1] + values[2] - 1,
                destStart: values[0],
                destEnd: values[0] + values[2] - 1
            });
            break;
        default:
            // detect new step
            if (line == 'seed-to-soil map:') steps = 1;
            else if (line == 'soil-to-fertilizer map:') steps = 2;
            else if (line == 'fertilizer-to-water map:') steps = 3;
            else if (line == 'water-to-light map:') steps = 4;
            else if (line == 'light-to-temperature map:') steps = 5;
            else if (line == 'temperature-to-humidity map:') steps = 6;
            else if (line == 'humidity-to-location map:') steps = 7;
            break;
    }
});

file.on('close', () => { 
    var result = -1;

    // sort maps
    for (var map in maps) {
        maps[map].sort((a,b) => a.sourceStart - b.sourceStart);
        if (maps[map][0].sourceStart != 0) {
            maps[map].unshift({sourceStart:0, sourceEnd:maps[map][0].sourceStart-1 , destStart:0, destEnd: maps[map][0].sourceStart-1});
        }
    }
    console.log(maps);

    // split seeds into ranges and offset due to mapping
    var ranges = [];
    for (var seed=0,len=1;seed<seeds.length-1;seed+=2,len+=2) {
        ranges.push({start:seeds[seed],end:seeds[seed]+seeds[len]-1});
    }
    ranges.sort((a,b) => a.start - b.start);
    console.log(ranges);

    // for each map, split ranges
    for (var map of maps) {
        ranges = mapSourceToDest(map,ranges);
        console.log(ranges);
    }

    // check low end of each range
    ranges.sort((a,b) => a.start - b.start);
    console.log(ranges);

    console.log('lowest location value: '+ranges[0].start);
});

// returns the new range divided based on the given map
// ranges is: array of objects { start: x, end: y }
function mapSourceToDest(map,ranges) {

    var resultArray = [];

    for (var sourceRange of Object.values(ranges)) {

        // split the current range based on the map
        var splitRange = processSingleRange(sourceRange,map);

        resultArray.push.apply(resultArray,splitRange);

    }

    //output new array of seed ranges
    return resultArray;
}

// returns an array of range objects, split based on the map
/*
  { 6 7   8 9 }
1 2 3 4 | 5 6 7 8

becomes

[{ 3 4 }, { 5 6 }]
*/
// range has: start, end
// mapRange has: sourceStart, sourceEnd, destStart, destEnd
function processSingleRange(range,map) {
    console.log('current range is: ',range);

    var curStart = range.start;
    var hangingRange = false; // tracks if there is a range that was split that still needs to be added

    var splitRange = []; // array to return if range is split into 2 or more ranges

    for (var mapRange of Object.values(map)) {
        console.log('checking map range: ',mapRange);

        // compare source range to map range
        var offset = (mapRange.destStart - mapRange.sourceStart);

        // case 1: full overlap (range is entirely within map range) - return dest range values over source range
        if (curStart >= mapRange.sourceStart && range.end <= mapRange.sourceEnd) {

            // convert source values to dest values
            var newStart = curStart + offset;
            var newEnd = range.end + offset;

            splitRange.push({start:newStart,end:newEnd});
            hangingRange = false;
            break;
        }

        // case 3: partial overlap - end goes past map range
        else if ( (curStart >= mapRange.sourceStart && curStart <= mapRange.sourceEnd) && range.end > mapRange.sourceEnd ) {
            // split range into { start, sourceEnd } and { sourceEnd+1, end }
            // convert first range to dest values
            var newRangeStart = curStart + offset;
            var newRangeEnd = mapRange.sourceEnd + offset;
            splitRange.push({start:newRangeStart,end:newRangeEnd});

            // set curStart to sourceEnd+1 and move to next map range - the next range will contain curStart
            curStart = mapRange.sourceEnd + 1;
            hangingRange = true;
        }
    }

    // if no ranges are added to the output array, return range
    if (splitRange.length == 0) {
        splitRange.push(range);
    } else if (hangingRange) { // if a range was split and there is still a range to add, add it to the end
        splitRange.push({start:curStart,end:range.end});
    }

    return splitRange;

}