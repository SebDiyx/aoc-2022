export {};

type NestedNumberArray = (number | NestedNumberArray)[];

const input = await Deno.readTextFile('./input.txt');

const packetPairs = input
    .split('\n\n')
    .map((packetPair) => packetPair.split('\n').map((packet) => JSON.parse(packet))) as [
    NestedNumberArray,
    NestedNumberArray,
][];

function isPairInCorrectOrder(
    packetPair: [number | NestedNumberArray, number | NestedNumberArray],
): boolean | undefined {
    let [left, right] = packetPair;

    // Both are arrays
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let ii = 0; ii < left.length && ii < right.length; ii++) {
            const correct = isPairInCorrectOrder([left[ii], right[ii]]);
            if (correct !== undefined) return correct;
        }

        if (left.length < right.length) return true;
        if (left.length > right.length) return false;
        return;
    }

    // Both are numbers
    if (typeof left === 'number' && typeof right === 'number') {
        if (left < right) return true;
        if (left > right) return false;
        return;
    }

    // Type mismatch
    if (typeof left === 'number') {
        left = [left];
    } else if (typeof right === 'number') {
        right = [right];
    }
    return isPairInCorrectOrder([left, right]);
}

const correctPacketPairsIndexes = packetPairs.reduce((acc, packetPair, idx) => {
    if (isPairInCorrectOrder(packetPair)) {
        return [...acc, idx + 1];
    } else {
        return acc;
    }
}, [] as number[]);

const sumOfCorrectIndexes = correctPacketPairsIndexes.reduce((total, idx) => total + idx, 0);
console.log(sumOfCorrectIndexes);
