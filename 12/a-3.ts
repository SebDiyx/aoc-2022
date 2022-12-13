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

while (incompletePaths.length > 0) {
    const newIncompletePaths: Point[][] = [];
    for (const incompletePath of incompletePaths) {
        const lastPoint = incompletePath[incompletePath.length - 1];
        const validMoves = getValidMoves(lastPoint);

        for (const move of validMoves) {
            if (visitedPoints.has(JSON.stringify(move))) continue;

            visitedPoints.add(JSON.stringify(move));

            const newIncompletePath = [...incompletePath, move];

            if (move.x === goal.x && move.y === goal.y) {
                console.log('Goal', newIncompletePath.length - 1);
                Deno.exit();
            } else {
                newIncompletePaths.push(newIncompletePath);
            }
        }
    }

    incompletePaths = newIncompletePaths;
}
