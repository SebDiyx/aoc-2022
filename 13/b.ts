export {};

type NestedNumberArray = (number | NestedNumberArray)[];

const input = await Deno.readTextFile('./input.txt');

const packets = input
    .split('\n')
    .map((packet) => {
        if (packet) return JSON.parse(packet);
    })
    .filter(Boolean);

const divider1 = [[2]];
const divider2 = [[6]];
packets.push(divider1, divider2);

function arePacketsInCorrectOrder(
    a: number | NestedNumberArray,
    b: number | NestedNumberArray,
): boolean | undefined {
    // Both are arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        for (let ii = 0; ii < a.length && ii < b.length; ii++) {
            const correct = arePacketsInCorrectOrder(a[ii], b[ii]);
            if (correct !== undefined) return correct;
        }

        if (a.length < b.length) return true;
        if (a.length > b.length) return false;
        return;
    }

    // Both are numbers
    if (typeof a === 'number' && typeof b === 'number') {
        if (a < b) return true;
        if (a > b) return false;
        return;
    }

    // Type mismatch
    if (typeof a === 'number') {
        a = [a];
    } else if (typeof b === 'number') {
        b = [b];
    }
    return arePacketsInCorrectOrder(a, b);
}

const sortedPackets = packets.sort((a, b) => (arePacketsInCorrectOrder(a, b) ? -1 : 1));

const divider1Index = sortedPackets.findIndex((packet) => packet === divider1) + 1;
const divider2Index = sortedPackets.findIndex((packet) => packet === divider2) + 1;
console.log(divider1Index * divider2Index); // TODO: seb remove <------------
