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
    'J':4,
    'T':5,
    '9':6,
    '8':7,
    '7':8,
    '6':9,
    '5':10,
    '4':11,
    '3':12,
    '2':13
}

file.on('line', (line) => {
    var handBid = line.split(' ');

    var hand = {
        hand: handBid[0],
        bid: parseInt(handBid[1]),
    }

    var type = findHandType(hand);
    hand.type = type;

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

    // if all cards are the same, five of a kind
    switch(handMap.size) {
        case 1: // all cards are the same
            return 'fiveofakind';
        case 5: // all cards are different
            return 'highcard';
        case 2: // only 2 different cards, either full house or 4 of a kind
            for (var count of handMap.values()) {
                if (count == 4) return 'fourofakind'; // four of one card
            }
            return 'fullhouse'; // 3 and 2, full house
        case 3: // 3 different cards, could be three of a kind or two pair
            for (var count of handMap.values()) {
                if (count == 3) return 'threeofakind'; // three of one card
            }
            return 'twopair'; // if no card has a count of 3, must be two pair
        case 4: // must be one pair
            return 'onepair';

    }
}