export {};

type Pos = { x: number; y: number };
type Path = { pos: Pos; parent?: Path; children: Path[] };

const input = await Deno.readTextFile('./input.txt');

function getElevation(elevationStr: string): number {
    return elevationStr.charCodeAt(0) - 96;
}

let startingPos: Pos = { x: 0, y: 0 };
let goal: Pos = { x: 0, y: 0 };

const elevationsMap = input.split('\n').map((line, y) =>
    line.split('').map((cell, x) => {
        if (cell === 'S') {
            startingPos = { x, y };
            return getElevation('a');
        }

        if (cell === 'E') {
            goal = { x, y };
            return getElevation('z');
        }

        return getElevation(cell);
    }),
);

function isPosAlreadyInPath(pos: Pos, path: Pos[]) {
    return path.some(({ x, y }) => x === pos.x && y === pos.y);
}

let shortestPath: Pos[] = [];
function setShortestPath(pos: Pos, path: Pos[]) {
    const { x, y } = pos;

    console.log(pos); // TODO: seb remove <------------

    // We've reached our goal
    if (x === goal.x && y === goal.y) {
        console.log('GOALLLLLL'); // TODO: seb remove <------------
        if (!shortestPath.length || shortestPath.length > path.length) shortestPath = path;
        return;
    }

    if (!!shortestPath.length && path.length >= shortestPath.length) return;

    const currHeight = elevationsMap[y][x];

    // Check left
    const leftPos = { x: x - 1, y };
    if (
        leftPos.x >= 0 &&
        !isPosAlreadyInPath(leftPos, path) &&
        elevationsMap[y][leftPos.x] <= currHeight + 1
    ) {
        setShortestPath(leftPos, [...path, leftPos]);
    }

    // Check up
    const upPos = { x, y: y - 1 };
    if (
        upPos.y >= 0 &&
        !isPosAlreadyInPath(upPos, path) &&
        elevationsMap[upPos.y][x] <= currHeight + 1
    ) {
        setShortestPath(upPos, [...path, upPos]);
    }

    // Check down
    const downPos = { x, y: y + 1 };
    if (
        downPos.y < elevationsMap.length &&
        !isPosAlreadyInPath(downPos, path) &&
        elevationsMap[downPos.y][x] <= currHeight + 1
    ) {
        setShortestPath(downPos, [...path, downPos]);
    }

    // Check right
    const rightPos = { x: x + 1, y };
    if (
        rightPos.x < elevationsMap[y].length &&
        !isPosAlreadyInPath(rightPos, path) &&
        elevationsMap[y][rightPos.x] <= currHeight + 1
    ) {
        setShortestPath(rightPos, [...path, rightPos]);
    }
}

setShortestPath(startingPos, []);
console.log((shortestPath ?? []).length);

// setShortestPath(startingPos);
// console.log(shortestPath); // TODO: seb remove <------------
