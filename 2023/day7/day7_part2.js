const fs = require('node:fs');
const readline = require('readline');

const file = readline.createInterface({
    input: fs.createReadStream('day7_input.txt'),
    output: process.stdout,
    terminal: false
});

var hands = [];

var handRank = {
    'fiveofakind':1,
    'fourofakind':2,
    'fullhouse':3,
    'threeofakind':4,
    'twopair':5,
    'onepair':6,
    'highcard':7
};

var cardRanks = {
    'A':1,
    'K':2,
    'Q':3,
    'T':4,
    '9':5,
    '8':6,
    '7':7,
    '6':8,
    '5':9,
    '4':10,
    '3':11,
    '2':12,
    'J':13
}

file.on('line', (line) => {
    var handBid = line.split(' ');

    var hand = {
        hand: handBid[0],
        bid: parseInt(handBid[1]),
    }

    var type = findHandType(hand);
    hand.type = type;

    console.log(`${hand.hand} is a ${type}`);

    hands.push(hand);

});

file.on('close',() => {
    hands.sort((a,b) => {
        // compare hand types and sort by ascending rank (highcard -> fiveofakind)

        if (handRank[b.type] < handRank[a.type]) {
            return -1;
        } else if (handRank[a.type] < handRank[b.type]) {
            return 1;
        } else { // hands are equal rank
            for (var c in a.hand) {
                if (a.hand[c] != b.hand[c]) return cardRanks[b.hand[c]] - cardRanks[a.hand[c]];
            }
            return 0;
        }
    });

    var total = 0;
    for (var rank in hands) {
        //console.log(hands[rank]);
        // loop over hands and calculate bid winnings
        var winnings = (+rank+1) * hands[rank].bid;
        console.log(`hand ${hands[rank].hand} bids ${hands[rank].bid} is rank ${+rank+1} and wins ${winnings}`);

        total += winnings;
    }
    console.log(`total score is ${total}`);
});

function findHandType(hand) {

    var handMap = new Map();

    // determine what type of hand

    // separate hand into sets of the same card
    for (var card of hand.hand) {
        if (handMap.has(card)) {
            handMap.set(card,handMap.get(card)+1);
        } else {
            handMap.set(card,1);
        }
    }
    
    switch(handMap.size) {
        case 1:
            return 'fiveofakind'; // if all cards are the same, five of a kind
        case 2: // could be five (with joker); four of a kind, full house
            if (handMap.has('J')) {
                return 'fiveofakind'; // joker + one other card = 5ofakind
            } else { // no jokers
                for (var count of handMap.values()) {
                    if (count == 4) return 'fourofakind'; // four of one card
                }
                return 'fullhouse'; // 3 and 2, full house
            }
        case 3: 
            if (handMap.has('J')) { // if joker, can be full hose or 4 of a kind
                // four of a kind
                for (var count of handMap.values()) {
                    if (count + handMap.get('J') == 4) return 'fourofakind';
                }
                return 'fullhouse';
            } else { // no jokers, can be 3ofakind or 2 pair
                for (var count of handMap.values()) {
                    if (count == 3) return 'threeofakind'; // three of one card
                }
                return 'twopair'; // if no card has a count of 3, must be two pair
            }
        case 4:
            if (handMap.has('J')) { // if joker, can only be 3 of a kind
                return 'threeofakind'
            } else {
                // can only be 1 pair
                return 'onepair';
            }
        case 5: // 5 diff cards
            if (handMap.has('J')) {
                return 'onepair';
            } else {
                return 'highcard';
            }
        default:
            throw 'bad';
    }
}