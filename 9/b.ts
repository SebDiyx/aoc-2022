export {};

type Pos = { x: number; y: number };

const input = await Deno.readTextFile('./input.txt');

const movements = input.split('\n').reduce((acc: string[], line) => {
    const [direction, strAmount] = line.split(' ');
    const moves: string[] = Array(parseInt(strAmount)).fill(direction);
    return [...acc, ...moves];
}, []);

function shouldKnotMove(headPos: Pos, tailPos: Pos) {
    const xDist = Math.abs(headPos.x - tailPos.x);
    const yDist = Math.abs(headPos.y - tailPos.y);
    return xDist > 1 || yDist > 1;
}

function getNewKnotPos(headPos: Pos, tailPos: Pos) {
    const newPos = { x: tailPos.x, y: tailPos.y };

    if (headPos.y !== tailPos.y) {
        const yDiff = headPos.y - tailPos.y;
        newPos.y = yDiff > 0 ? tailPos.y + 1 : tailPos.y - 1;
    }

    if (headPos.x !== tailPos.x) {
        const xDiff = headPos.x - tailPos.x;
        newPos.x = xDiff > 0 ? tailPos.x + 1 : tailPos.x - 1;
    }

    return newPos;
}

const headPos: Pos = { x: 0, y: 0 };
const trailingKnotPositions: Pos[] = Array(9)
    .fill(null)
    .map(() => ({ x: 0, y: 0 }));

const tailVisited: Set<string> = new Set([JSON.stringify({ x: 0, y: 0 })]);

for (const move of movements) {
    if (move === 'U') headPos.y++;
    if (move === 'D') headPos.y--;
    if (move === 'R') headPos.x++;
    if (move === 'L') headPos.x--;

    let parentKnot = headPos;
    trailingKnotPositions.forEach((currKnot, idx) => {
        if (shouldKnotMove(parentKnot, currKnot)) {
            const newPos = getNewKnotPos(parentKnot, currKnot);

            trailingKnotPositions[idx] = newPos;

            if (idx === trailingKnotPositions.length - 1) tailVisited.add(JSON.stringify(newPos));
        }
        parentKnot = trailingKnotPositions[idx];
    });
}

console.log([...tailVisited].length);
