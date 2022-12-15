export {};

type Point = { x: number; y: number };
type Sensor = { location: Point; closestBeacon: Point };

const input = await Deno.readTextFile('./input.txt');

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
    return { x: point.x - minX + largestDist, y: point.y };
}

// Build grid
const numColumns = maxX - minX + 2 * largestDist + 1;

const line = Array(numColumns).fill('.');

sensors.forEach((sensor) => {
    const { y } = adjustPoint({ x: 0, y: 2000000 });

    const { x: sensorX, y: sensorY } = adjustPoint(sensor.location);
    const { x: beaconX } = adjustPoint(sensor.closestBeacon);

    if (sensor.location.y === y) line[sensorX] = 'S';
    if (sensor.closestBeacon.y === y) line[beaconX] = 'B';

    const dist = calcDist(sensor.location, sensor.closestBeacon);

    for (let x = sensorX - dist; x <= sensorX + dist; x++) {
        if (calcDist({ x: sensorX, y: sensorY }, { x, y }) <= dist && line[x] === '.') {
            line[x] = '#';
        }
    }
});

console.log(line.join(''));

const beaconFreePoints = line.reduce((total, point) => {
    if (point === '#') return total + 1;
    return total;
}, 0);

console.log(beaconFreePoints); // TODO: seb remove <------------
