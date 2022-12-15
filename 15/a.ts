export {};

type Point = { x: number; y: number };
type Sensor = { location: Point; closestBeacon: Point };

const input = await Deno.readTextFile('./test-input.txt');

function calcDist(a: Point, b: Point) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
let largestDist = 0;
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

    if (sensorX < minX) minX = sensorX;
    if (beaconX < minX) minX = beaconX;
    if (sensorX > maxX) maxX = sensorX;
    if (beaconX > maxX) maxX = beaconX;

    if (sensorY < minY) minY = sensorY;
    if (beaconY < minY) minY = beaconY;
    if (sensorY > maxY) maxY = sensorY;
    if (beaconY > maxY) maxY = beaconY;

    const sensor = {
        location: {
            x: sensorX,
            y: sensorY,
        },
        closestBeacon: {
            x: beaconX,
            y: beaconY,
        },
    };

    const dist = calcDist(sensor.location, sensor.closestBeacon);

    if (dist > largestDist) largestDist = dist;

    return sensor;
});

function adjustPoint(point: Point): Point {
    return { x: point.x - minX + largestDist, y: point.y - minY + largestDist };
}

// Build grid
const numRows = maxY - minY + 2 * largestDist + 1;
const numColumns = maxX - minX + 2 * largestDist + 1;

const map = Array(numRows)
    .fill(null)
    .map(() => Array(numColumns).fill('.'));

sensors.forEach((sensor) => {
    const { x: sensorX, y: sensorY } = adjustPoint(sensor.location);
    map[sensorY][sensorX] = 'S';

    const { x: beaconX, y: beaconY } = adjustPoint(sensor.closestBeacon);
    map[beaconY][beaconX] = 'B';

    const dist = calcDist(sensor.location, sensor.closestBeacon);

    for (let y = sensorY - dist; y <= sensorY + dist; y++) {
        for (let x = sensorX - dist; x <= sensorX + dist; x++) {
            if (calcDist({ x: sensorX, y: sensorY }, { x, y }) <= dist && map[y][x] === '.') {
                map[y][x] = '#';
            }
        }
    }
});

console.log(map.map((line) => line.join('')).join('\n'));

const { y: rowToCheck } = adjustPoint({ x: 0, y: 10 });

const beaconFreePoints = map[rowToCheck].reduce((total, point) => {
    if (point === '#') return total + 1;
    return total;
}, 0);

console.log(map[rowToCheck].join(''));
console.log(beaconFreePoints);
