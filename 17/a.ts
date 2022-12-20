export {};

const tunnelWidth = 7;
const windPattern = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'.split('');

const input = await Deno.readTextFile('./test-input.txt');

const rocks = input.split('\n\n').map((rock) => {
    const lines = rock.split('\n');
    return lines.map((line) => line.split(''));
});

// const initialTunnelHeight = rocks[0].length + 3;

const tunnel: string[][] = [];

function printTunnel() {
    // return;
    console.log(
        [...tunnel]
            .reverse()
            .map((row) => `|${row.join('')}|`)
            .join('\n') + '\n+-------+\n',
    );
}

let prevBottomLeftPos: { x: number; y: number } | null = null;
function addRockToTunnel(
    rock: string[][],
    bottomLeftPos: { x: number; y: number },
    resting = false,
) {
    const rockChar = resting ? '#' : '@';

    // Remove previous
    if (prevBottomLeftPos) {
        for (let y = 0; y < rock.length; y++) {
            for (let x = 0; x < rock[y].length; x++) {
                if (tunnel[prevBottomLeftPos.y + y]) {
                    tunnel[prevBottomLeftPos.y + y][prevBottomLeftPos.x + x] = '.';
                }
            }
        }
    }

    // Set our new position
    for (let y = 0; y < rock.length; y++) {
        for (let x = 0; x < rock[y].length; x++) {
            tunnel[bottomLeftPos.y + y][bottomLeftPos.x + x] = rock[y][x] === '#' ? rockChar : '.';
        }
    }

    prevBottomLeftPos = !resting ? { ...bottomLeftPos } : null;

    printTunnel();
}

let numRocksPlaced = 0;
let highestPoint = 0;
while (numRocksPlaced < 2022) {
    const rock = [...rocks[numRocksPlaced % rocks.length]].reverse();
    const rockBottomLeftPos = { x: 2, y: tunnel.length + 3 };

    tunnel.push(
        ...Array(rock.length + 3)
            .fill(null)
            .map(() => Array(tunnelWidth).fill('.')),
    );

    printTunnel();
    addRockToTunnel(rock, rockBottomLeftPos);

    let rockPlaced = false;
    while (!rockPlaced) {
        // Handle wind movement -----------------------------------------------
        // Get the windDir and add it back to the end
        const windDir = windPattern.splice(0, 1)[0];
        windPattern.push(windDir);

        if (windDir === '>') {
            // Push Right
            const rockRightSidePos = rockBottomLeftPos.x + rock[0].length;
            const canMoveRight = rock.every((_, idx) => {
                return tunnel[rockBottomLeftPos.y + idx][rockRightSidePos] !== '#';
            });
            if (rockRightSidePos + 1 <= tunnelWidth && canMoveRight) {
                rockBottomLeftPos.x++;
            }
        } else {
            const rockLeftSidePos = rockBottomLeftPos.x;
            const canMoveLeft = rock.every(
                (_, idx) => tunnel[rockBottomLeftPos.y + idx][rockLeftSidePos - 1] !== '#',
            );
            // Push Left
            if (rockLeftSidePos - 1 >= 0 && canMoveLeft) {
                rockBottomLeftPos.x--;
            }
        }
        // --------------------------------------------------------------------

        // Handle rock falling ------------------------------------------------
        let rockMovable = true;
        outer: for (let y = 0; y < rock.length; y++) {
            for (let x = 0; x < rock[y].length; x++) {
                if (rock[y][x] === '.') continue;

                const atBottom = rockBottomLeftPos.y + y - 1 < 0;
                if (
                    atBottom ||
                    tunnel[rockBottomLeftPos.y + y - 1][rockBottomLeftPos.x + x] === '#'
                ) {
                    rockMovable = false;
                    break outer;
                }
            }
        }
        if (rockMovable) {
            rockBottomLeftPos.y--;
            tunnel.pop();
        } else {
            rockPlaced = true;
        }

        addRockToTunnel(rock, rockBottomLeftPos, !rockMovable);
        // --------------------------------------------------------------------
    }
    console.log('------------------------------------\n'); // TODO: seb remove <------------

    highestPoint = rockBottomLeftPos.y + rock.length - 1;
    numRocksPlaced++;
}

printTunnel();

console.log(tunnel.filter((row) => !row.every((c) => c === '.')).length);
console.log(highestPoint);
