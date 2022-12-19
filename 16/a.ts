export {};

type Valve = {
    name: string;
    flowRate: number;
    connectedNames: string[];
    connected: Valve[];
    maxPressure: number;
};

const input = await Deno.readTextFile('./test-input.txt');

function parseInput(input: string) {
    const valves = input.split('\n').map((line): Valve => {
        const [name, flowRateStr, ...connectedNames] = line
            .replace('Valve ', '')
            .replace('has flow rate=', '')
            .replace(';', '')
            .replace('tunnels lead to valves ', '')
            .replace('tunnel lead to valve ', '')
            .replace('tunnel leads to valve ', '')
            .replaceAll(',', '')
            .split(' ');

        return {
            name,
            flowRate: parseInt(flowRateStr),
            connected: [],
            connectedNames,
            maxPressure: 0,
        };
    });

    for (const valve of valves) {
        for (const connectedName of valve.connectedNames) {
            const connectedValve = valves.find((valve) => valve.name === connectedName);

            if (connectedValve) valve.connected.push(connectedValve);
        }
    }

    return valves;
}

// const visitedValveNames = new Set<string>(valves[0].name);
// while (valvesToVisit.length > 0) {
//     // Take from the back, since we're pushing to the front
//     const currValve = valvesToVisit.pop();
//     if (!currValve) break;

//     remainingTime--;
//     const currPressure = remainingTime * currValve.flowRate;
//     if (currPressure > currValve.maxPressure) currValve.maxPressure = currPressure;
//     if (remainingTime === 0) break;

//     for (const valve of currValve.connected) {
//         if (!visitedValveNames.has(valve.name)) {
//             valvesToVisit.unshift(valve);
//             visitedValveNames.add(valve.name);
//         }
//     }
// }

// console.log(
//     valves.map((valve) => ({
//         name: valve.name,
//         rate: valve.flowRate,
//         maxPressure: valve.maxPressure,
//     })),
// ); // TODO: seb remove <------------

function getTimeFromValve(start: Valve, end: Valve) {
    if (start.name === end.name) return 0;

    function getTimeFromValveRecc(valvesToVisit: Valve[], discovered: string[] = []): number {
        const currValve = valvesToVisit.pop();
        if (!currValve) return 0;
        for (const neighbor of currValve.connected) {
            if (!discovered.includes(neighbor.name)) {
                if (neighbor.name === end.name) return 1;
                valvesToVisit.unshift(neighbor);
            }
        }
        return getTimeFromValveRecc(valvesToVisit, discovered) + 1;
    }

    return getTimeFromValveRecc([start], [start.name]);
}

function getValveValue(valve: Valve, currValve: Valve, remainingTime: number) {
    return valve.flowRate * (remainingTime - getTimeFromValve(currValve, valve));
}

// const visitedValveNames = new Set<string>(valves[0].name);
// while (valvesToVisit.length > 0) {
//     // Take from the back, since we're pushing to the front
//     const currValve = valvesToVisit.pop();
//     if (!currValve) break;

//     remainingTime--;
//     const currPressure = remainingTime * currValve.flowRate;
//     if (currPressure > currValve.maxPressure) currValve.maxPressure = currPressure;
//     if (remainingTime === 0) break;

//     for (const valve of currValve.connected) {
//         if (!visitedValveNames.has(valve.name)) {
//             valvesToVisit.unshift(valve);
//             visitedValveNames.add(valve.name);
//         }
//     }
// }

// console.log(
//     valves.map((valve) => ({
//         name: valve.name,
//         rate: valve.flowRate,
//         maxPressure: valve.maxPressure,
//     })),
// ); // TODO: seb remove <------------

const valves = parseInput(input);
const openValves: Valve[] = [];

let remainingTime = 30;
let totalPressure = 0;

let currValve = valves[0];
while (remainingTime > 0) {
    const valvesToVisit = valves.filter((valve) => {
        return (
            !openValves.includes(valve) && getTimeFromValve(currValve, valve) <= remainingTime - 1
        );
    });

    // Sort in ascending order
    valvesToVisit.sort(
        (a, b) =>
            getValveValue(a, currValve, remainingTime) - getValveValue(b, currValve, remainingTime),
    );

    const nextValve = valvesToVisit.pop();
    if (!nextValve) break;

    // Move to the next valve with the highest max pressure
    remainingTime = remainingTime - getTimeFromValve(currValve, nextValve);
    currValve = nextValve;
    console.log('Moved to', currValve.name, currValve.flowRate, 'remaining', remainingTime); // TODO: seb remove <------------

    // Turn on the valve
    openValves.push(currValve);
    remainingTime--;
    totalPressure += remainingTime * currValve.flowRate;
    console.log('  Turned on', currValve.name, remainingTime, totalPressure); // TODO: seb remove <------------

    if (remainingTime === 0) break;

    for (const valve of currValve.connected) {
        console.log('    ' + valve.name); // TODO: seb remove <------------
        if (!openValves.includes(valve)) {
            valvesToVisit.push(valve);
        }
    }
}

console.log(remainingTime); // TODO: seb remove <------------
console.log(totalPressure); // TODO: seb remove <------------
