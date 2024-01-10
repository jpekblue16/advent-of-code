const fs = require('node:fs');
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

var seedToSoilMap = [];
var soilToFertMap = [];
var fertToWaterMap = [];
var waterToLightMap = [];
var lightToTempMap = [];
var tempToHumidityMap = [];
var humidityToLocMap = [];

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
            // seed to soil map
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            console.log(`destination start: ${values[0]}, source start: ${values[1]}, length: ${values[2]}`);
            seedToSoilMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 2:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            console.log(`destination start: ${values[0]}, source start: ${values[1]}, length: ${values[2]}`);
            soilToFertMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 3:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            fertToWaterMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 4:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            waterToLightMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 5:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            lightToTempMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 6:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            tempToHumidityMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
            });
            break;
        case 7:
            var values = line.split(' ').map(Number); // destination start point, source start point, number of elements
            humidityToLocMap.push({
                sourceStart: values[1],
                destStart: values[0],
                len: values[2]
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

    // process first seed range
    for (var seed = seeds[0]; seed < (seeds[0]+seeds[1]); ++seed) {
        // go through mapping chain to find location
        var soil = getValue(seed,seedToSoilMap);
        var fertilizer = getValue(soil,soilToFertMap);
        var water = getValue(fertilizer,fertToWaterMap);
        var light = getValue(water,waterToLightMap);
        var temp = getValue(light,lightToTempMap);
        var humidity = getValue(temp,tempToHumidityMap);
        var location = getValue(humidity,humidityToLocMap);
        if (result < 0 || location < result) result = location;
    }

    for (var seed = seeds[2]; seed < (seeds[2]+seeds[3]); ++seed) {
        //console.log(`processing seed: ${seed}`);
        // go through mapping chain to find location
        var soil = getValue(seed,seedToSoilMap);
        var fertilizer = getValue(soil,soilToFertMap);
        var water = getValue(fertilizer,fertToWaterMap);
        var light = getValue(water,waterToLightMap);
        var temp = getValue(light,lightToTempMap);
        var humidity = getValue(temp,tempToHumidityMap);
        var location = getValue(humidity,humidityToLocMap);
        if (result < 0 || location < result) result = location;
    }

    console.log('lowest location value: '+result);
});

function getValue(source,map) {
    for (var mapping of map) {
        if (mapping.sourceStart <= source && source < mapping.sourceStart + mapping.len) {
            return mapping.destStart + (source - mapping.sourceStart);
        }
    }

    return source; // if the source value wasnt found in the defined mapping, return same value
}



// function main() {
//     // process seeds and find lowest location number
//     for (var seed of seeds) {
//         // go through mapping chain to find location
//         var soil = getValue(seed,seedToSoilMap);
//         var fertilizer = getValue(soil,soilToFertMap);
//         var water = getValue(fertilizer,fertToWaterMap);
//         var light = getValue(water,waterToLightMap);
//         var temp = getValue(light,lightToTempMap);
//         var humidity = getValue(temp,tempToHumidityMap);
//         var location = getValue(humidity,humidityToLocMap);
//         if (result < 0 || location < result) result = location;
//     }
// }

// main();



