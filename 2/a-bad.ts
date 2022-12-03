export {};

// A, X === Rock -> 1
// B, Y === Paper -> 2
// C, Z === Scissors -> 3

// This got the correct answer ??????????????

const input = await Deno.readTextFile('./input.txt');
const rounds = input.split('\n').map((round) => round.split(' '));

let total = 0;
for (const round of rounds) {
    switch (round[0]) {
        case 'A':
            // Y so add 2 for paper and 3 for win
            total += 2 + 3;
            break;
        case 'B':
            // X so add 2 for paper and 3 for win
            total += 1 + 3;
            break;
        case 'C':
            // Z so add 2 for paper and 3 for win
            total += 3 + 3;
            break;
    }
}

console.log(total);
