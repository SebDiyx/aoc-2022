export {};

type Point = { x: number; y: number };
type Sensor = { location: Point; closestBeacon: Point; dist: number };
type Diamond = { top: Point; bottom: Point; left: Point; right: Point };

const input = await Deno.readTextFile('./input.txt');

function calcDist(a: Point, b: Point) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const MAX = 4000000;

const sensors: Sensor[] = input.split('\n').map((line) => {
    const [sensorStr, closestBeaconStr] = line.split(': ');
    const sensorPoint = sensorStr.replace('Sensor at ', '').replace('x=', '').replace(' y=', '');
    const beaconPoint = closestBeaconStr
        .replace('closest beacon is at ', '')
        .replace('x=', '')
        .replace(' y=', '');

    const [sensorXStr, sensorYStr] = sensorPoint.split(',');
    const [beaconXStr, beaconYStr] = beaconPoint.split(',');

    const sensorX = parseInt(sensorXStr);
    const sensorY = parseInt(sensorYStr);
    const beaconX = parseInt(beaconXStr);
    const beaconY = parseInt(beaconYStr);

    const sensor = {
        location: {
            x: sensorX,
            y: sensorY,
        },
        closestBeacon: {
            x: beaconX,
            y: beaconY,
        },
        dist: calcDist(
            {
                x: sensorX,
                y: sensorY,
            },
            {
                x: beaconX,
                y: beaconY,
            },
        ),
    };

    return sensor;
});

function getRowCoverage(row: number) {
    const coverages = [];
    for (const sensor of sensors) {
        const sensorCoverage = getSensorRowCoverage(sensor, row);
        if (sensorCoverage) coverages.push(sensorCoverage);
    }

    return mergeRowCoverages(coverages);
}

function getSensorRowCoverage(sensor: Sensor, row: number): [number, number] | null {
    const rowDistFromSensor = Math.abs(sensor.location.y - row);
    if (rowDistFromSensor > sensor.dist) return null;

    const coverageWidth = sensor.dist - rowDistFromSensor;
    return [sensor.location.x - coverageWidth, sensor.location.x + coverageWidth];
}

function mergeRowCoverages(coverages: [number, number][]) {
    coverages.sort((a, b) => a[0] - b[0]);

    const mergedCoverage = [];

    let prev = coverages.splice(0, 1)[0];
    for (const curr of coverages) {
        // Check if coverage and prevCoverage overlap or are within 1 of each other
        if (prev[1] >= curr[0] - 1) {
            prev = [prev[0], Math.max(prev[1], curr[1])];
        } else {
            mergedCoverage.push(prev);
            prev = curr;
        }
    }

    mergedCoverage.push(prev);

    return mergedCoverage;
}

for (let y = 0; y <= MAX; y++) {
    // rowCoverage represents ranges that cover the current row
    const rowCoverage = getRowCoverage(y);

    if (rowCoverage.length >= 2) {
        // The empty spot will be one after the end of the first coverage
        const x = rowCoverage[0][1] + 1;
        console.log(x, y);
        console.log(x * 4000000 + y);
        break;
    }
}
