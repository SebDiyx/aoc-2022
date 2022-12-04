export {};

const input = await Deno.readTextFile('./input.txt');

const elfPairs = input.split('\n').map((line) => {
    const [elf1, elf2] = line.split(',');
    const elf1Range = elf1.split('-').map((val) => parseInt(val, 10));
    const elf2Range = elf2.split('-').map((val) => parseInt(val, 10));
    return [elf1Range, elf2Range];
});

function isBetween(val: number, range: [number, number]) {
    return val >= range[0] && val <= range[1];
}

const pairsWithOverlap = elfPairs.filter((pair) => {
    const [elf1, elf2] = pair as [[number, number], [number, number]];
    const [elf1Start, elf1End] = elf1;
    const [elf2Start, elf2End] = elf2;
    return (
        (isBetween(elf1Start, elf2) && isBetween(elf1End, elf2)) ||
        (isBetween(elf2Start, elf1) && isBetween(elf2End, elf1))
    );
});

console.log(pairsWithOverlap.length);
