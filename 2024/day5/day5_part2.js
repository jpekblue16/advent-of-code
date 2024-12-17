const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day5_input.txt'),
    output: process.stdout,
    terminal: false
});

// store rules, page number -> array of numbers that must come after it
var rules = new Map();
var orders = new Array();

file.on('line', (line) => {

  if (line == '') return;

  // read in all the rules
  if (line.indexOf('|') != -1) {
    var rule = Array.from(line.split('|'),(v) => parseInt(v));

    //console.log(`adding rule: ${rule}`);

    // if number has a rule, add the page that must come after
    // otherwise add page to map
    if (rules.has(rule[0])) { 
      rules.get(rule[0]).add(rule[1]);
    } else { 
      rules.set(rule[0], new Set([rule[1]]));
    }
  }
  // read in each order, orders will all come after all rules
  else {
    orders.push(Array.from(line.split(','),(v) => parseInt(v)));
  }
});

file.on('close', () => {

  var total = 0;

  for (var order of orders) {
    var mid = Math.floor(order.length / 2);

    if (!isValidOrder(order)) {
      var fixedOrder = fixOrder(order);
      total += fixedOrder[mid];
    }
  }

  console.log(total);

});

function isValidOrder(order) {

  var soFar = new Set();

  for (var page of order) {
    // get all pages that must come after this page
    var after = new Set(rules.get(page));

    // if any have already been added, invalid order
    var intersect = new Set([...after].filter(i => soFar.has(i)));
    if (intersect.size > 0) return false;

    soFar.add(page);
  }

  return true;
}

// put the order in a valid sequence based on the rules
function fixOrder(order) {
  
  var fixedOrder = [];

  // for each page in the order
  for (var page of order) {
    // find how many pages that come after the page are present in the order
    var after = rules.get(page) || new Set();

    var intersection = new Set([...order].filter(i => after.has(i)));

    fixedOrder[order.length - intersection.size - 1] = page;
  }

  return fixedOrder;
}