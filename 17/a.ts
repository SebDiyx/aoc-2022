export {};

const windPattern = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>';

const input = await Deno.readTextFile('./test-input.txt');

const rocks = input.split('\n\n').map((rock) => {
    const lines = rock.split('\n');
    return lines.map((line) => line.split(''));
});
console.log(rocks); //TODO: Seb remove <--------------

for (const rock of rocks) {
    console.log(rock.map((line) => line.join('')).join('\n'));
    console.log(); //TODO: Seb remove <--------------
}

const initialTunnelHeight = rocks[0].length + 3;

const tunnel = Array(initialTunnelHeight).fill(new Array(7).fill('.'));

let numRocksPlaced = 0;
while (numRocksPlaced < 2022) {
    // Move

    numRocksPlaced++;
}

console.log(tunnel); //TODO: Seb remove <--------------
