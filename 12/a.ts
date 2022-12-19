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

function getListOfPathParents(path: Path) {
    const parents: Path[] = [];
    if (path.parent) {
        parents.push(path.parent);
        parents.push(...getListOfPathParents(path.parent));
    }
    return parents;
}

function isPosAlreadyInPath(pos: Pos, path: Path) {
    const parents = getListOfPathParents(path);
    return parents.some((path) => path.pos.x === pos.x && path.pos.y === pos.y);
}

// let shortestPath = 999;
// function setShortestPath(pos: Pos, depth = 0) {
//     const { x, y } = pos;

//     console.log(x, y); // TODO: seb remove <------------

//     // We've reached our goal
//     if (x === goal.x && y === goal.y) {
//         if (depth < shortestPath) shortestPath = depth;
//         console.log('GOALLLLLL'); // TODO: seb remove <------------
//         return;
//     }

//     if (depth >= shortestPath) return;

//     const currHeight = elevationsMap[y][x];

//     // Check up
//     const upPos = { x, y: y - 1 };
//     if (upPos.y >= 0 && elevationsMap[upPos.y][x] <= currHeight + 1) {
//         // const childPath: Path = { pos: upPos, parent: path, children: [] };
//         // path.children.push(childPath);
//         setShortestPath(upPos, depth + 1);
//     }

//     // Check down
//     const downPos = { x, y: y + 1 };
//     if (downPos.y < elevationsMap.length && elevationsMap[downPos.y][x] <= currHeight + 1) {
//         setShortestPath(downPos, depth + 1);
//     }

//     // Check left
//     const leftPos = { x: x - 1, y };
//     if (leftPos.x >= 0 && elevationsMap[y][leftPos.x] <= currHeight + 1) {
//         setShortestPath(leftPos, depth + 1);
//     }

//     // Check right
//     const rightPos = { x: x + 1, y };
//     if (rightPos.x < elevationsMap[y].length && elevationsMap[y][rightPos.x] <= currHeight + 1) {
//         setShortestPath(rightPos, depth + 1);
//     }
// }

function populatePath(path: Path) {
    const { x, y } = path.pos;

    console.log(x, y); // TODO: seb remove <------------

    // We've reached our goal
    if (x === goal.x && y === goal.y) {
        console.log('GOALLLLLL'); // TODO: seb remove <------------
        return;
    }

    const currHeight = elevationsMap[y][x];

    // Check up
    const upPos = { x, y: y - 1 };
    if (
        upPos.y >= 0 &&
        !isPosAlreadyInPath(upPos, path) &&
        elevationsMap[upPos.y][x] <= currHeight + 1
    ) {
        const childPath: Path = { pos: upPos, parent: path, children: [] };
        path.children.push(childPath);
        populatePath(childPath);
    }

    // Check down
    const downPos = { x, y: y + 1 };
    if (
        downPos.y < elevationsMap.length &&
        !isPosAlreadyInPath(downPos, path) &&
        elevationsMap[downPos.y][x] <= currHeight + 1
    ) {
        const childPath: Path = { pos: downPos, parent: path, children: [] };
        path.children.push(childPath);
        populatePath(childPath);
    }

    // Check left
    const leftPos = { x: x - 1, y };
    if (
        leftPos.x >= 0 &&
        !isPosAlreadyInPath(leftPos, path) &&
        elevationsMap[y][leftPos.x] <= currHeight + 1
    ) {
        const childPath: Path = { pos: leftPos, parent: path, children: [] };
        path.children.push(childPath);
        populatePath(childPath);
    }

    // Check right
    const rightPos = { x: x + 1, y };
    if (
        rightPos.x < elevationsMap[y].length &&
        !isPosAlreadyInPath(rightPos, path) &&
        elevationsMap[y][rightPos.x] <= currHeight + 1
    ) {
        const childPath: Path = { pos: rightPos, parent: path, children: [] };
        path.children.push(childPath);
        populatePath(childPath);
    }
}

const pathsFromStartingPos: Path = { pos: startingPos, children: [] };
populatePath(pathsFromStartingPos);
console.log(pathsFromStartingPos);

// setShortestPath(startingPos);
// console.log(shortestPath); // TODO: seb remove <------------
