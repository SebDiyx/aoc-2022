export {};

type Point = { x: number; y: number };
const ROCK = '#';
const AIR = '.';
const SAND = 'o';
type Material = typeof ROCK | typeof AIR | typeof SAND | '+';

const sandSource: Point = { y: 0, x: 500 };

const input = await Deno.readTextFile('./input.txt');

let minX = sandSource.x;
let minY = sandSource.y;
let maxX = sandSource.x;
let maxY = sandSource.y;
const paths = input.split('\n').map((path) =>
    path.split(' -> ').map((point) => {
        const [xStr, yStr] = point.split(',');
        const x = parseInt(xStr);
        const y = parseInt(yStr);

        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;

        return { x, y };
    }),
) as Point[][];

// Initialize our cave
const numRows = maxY - minY + 1 + 1;
const numColumns = (maxX - minX + 1) * 10;

const map: Material[][] = Array(numRows)
    .fill(null)
    .map(() => Array(numColumns).fill(AIR));

map.push(Array(numColumns).fill(ROCK));

const getAdjustedX = (x: number) => x - minX + (4 / 10) * numColumns;
const getAdjustedY = (y: number) => y - minY;

map[getAdjustedY(sandSource.y)][getAdjustedX(sandSource.x)] = '+';

// Add our rocks to our map
for (const path of paths) {
    for (let ii = 0; ii < path.length - 1; ii++) {
        const { x: startX, y: startY } = path[ii];
        const { x: endX, y: endY } = path[ii + 1];

        // Vertical Line
        if (startX === endX) {
            const x = getAdjustedX(startX);
            const start = startY < endY ? getAdjustedY(startY) : getAdjustedY(endY);
            const end = startY < endY ? getAdjustedY(endY) : getAdjustedY(startY);
            for (let y = start; y <= end; y++) {
                map[y][x] = ROCK;
            }
        }

        // Horizontal Line
        if (startY === endY) {
            const y = getAdjustedY(startY);
            const start = startX < endX ? getAdjustedX(startX) : getAdjustedX(endX);
            const end = startX < endX ? getAdjustedX(endX) : getAdjustedX(startX);

            for (let x = start; x <= end; x++) {
                map[y][x] = ROCK;
            }
        }
    }
}

for (const row of map) {
    console.log(row.join('')); // TODO: seb remove <------------
}

// Loop until sand reaches the source
let numSand = 0;
let sandAtSource = false;
while (!sandAtSource) {
    let sandSettled = false;
    let x = getAdjustedX(sandSource.x);
    let y = getAdjustedY(sandSource.y);

    while (!sandSettled) {
        // Sand movements
        // 1. Down
        if (map[y + 1][x] === AIR) {
            y++;
            continue;
        }

        // 2. Down and left diagonally
        if (map[y + 1][x - 1] === AIR) {
            y++;
            x--;
            continue;
        }

        // 3. Down and right diagonally
        if (map[y + 1][x + 1] === AIR) {
            y++;
            x++;
            continue;
        }

        map[y][x] = SAND;
        sandSettled = true;

        if (y === getAdjustedY(sandSource.y) && x === getAdjustedX(sandSource.x)) {
            sandAtSource = true;
        }
    }

    numSand++;
}

for (const row of map) {
    console.log(row.join('')); // TODO: seb remove <------------
}

console.log(numSand); // TODO: seb remove <------------
