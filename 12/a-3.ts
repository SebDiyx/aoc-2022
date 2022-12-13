export {};

type Point = { x: number; y: number };

const input = await Deno.readTextFile('./input.txt');

function getElevation(elevationStr: string): number {
    return elevationStr.charCodeAt(0) - 96;
}

let start: Point = { x: 0, y: 0 };
let goal: Point = { x: 0, y: 0 };

const elevationMap = input.split('\n').map((line, y) =>
    line.split('').map((cell, x) => {
        if (cell === 'S') {
            start = { x, y };
            return getElevation('a');
        }

        if (cell === 'E') {
            goal = { x, y };
            return getElevation('z');
        }

        return getElevation(cell);
    }),
);

function getValidMoves(point: Point) {
    const validMoves: Point[] = [];

    const { x, y } = point;
    const currHeight = elevationMap[point.y][point.x];

    const leftPos = { x: x - 1, y };
    if (leftPos.x >= 0 && elevationMap[y][leftPos.x] <= currHeight + 1) {
        validMoves.push(leftPos);
    }

    // Check up
    const upPos = { x, y: y - 1 };
    if (upPos.y >= 0 && elevationMap[upPos.y][x] <= currHeight + 1) {
        validMoves.push(upPos);
    }

    // Check down
    const downPos = { x, y: y + 1 };
    if (downPos.y < elevationMap.length && elevationMap[downPos.y][x] <= currHeight + 1) {
        validMoves.push(downPos);
    }

    // Check right
    const rightPos = { x: x + 1, y };
    if (rightPos.x < elevationMap[y].length && elevationMap[y][rightPos.x] <= currHeight + 1) {
        validMoves.push(rightPos);
    }

    return validMoves;
}

const visitedPoints = new Set<string>([JSON.stringify(start)]);
let incompletePaths: Point[][] = [[start]];

// Keep going until we've completed every path or we meet our goal
while (incompletePaths.length > 0) {
    // Keep track of our new list of paths (this will override our old one)
    const newIncompletePaths: Point[][] = [];

    for (const incompletePath of incompletePaths) {
        // Get the last point in the current path and get all the valid moves from there
        const lastPoint = incompletePath[incompletePath.length - 1];
        const validMoves = getValidMoves(lastPoint);

        for (const move of validMoves) {
            // Check if we've visited this point already, that means theres a faster route to that point
            if (visitedPoints.has(JSON.stringify(move))) continue;

            visitedPoints.add(JSON.stringify(move));

            // Create a new copy of our path with our next move
            const newIncompletePath = [...incompletePath, move];

            // Check if we've reach our goal, if not add our current path to the list of new incomplete paths
            if (move.x === goal.x && move.y === goal.y) {
                console.log('Goal', newIncompletePath.length - 1);
                Deno.exit();
            } else {
                newIncompletePaths.push(newIncompletePath);
            }
        }
    }

    // Override our old list of incompletePaths
    incompletePaths = newIncompletePaths;
}
