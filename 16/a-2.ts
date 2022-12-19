export {};

type Valve = {
    name: string;
    flowRate: number;
    connectedNames: string[];
};

const input = await Deno.readTextFile('./input.txt');

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
        connectedNames,
    };
});

const valvesByName: { [name: string]: Valve & { distanceMap: any } } = valves.reduce(
    (acc, valve) => {
        return {
            ...acc,
            [valve.name]: valve,
        };
    },
    {},
);

function getActiveValves() {
    return valves.filter((valve) => valve.flowRate > 0);
}

function getDistanceMap(startName: string, distances: any = {}) {
    if (valvesByName[startName].distanceMap) return valvesByName[startName].distanceMap;
    const spread = (name: string, steps: number) => {
        if (distances[name] !== undefined && distances[name] <= steps) return;
        distances[name] = steps;
        valvesByName[name].connectedNames.forEach((v) => spread(v, steps + 1));
    };
    spread(startName, 0);
    valvesByName[startName].distanceMap = distances;
    return distances;
}

type Path = {
    currValve: string;
    activeNodes: string[];
    remainingTime: number;
    finished: boolean;
    steps: string[];
    releasedPressure: number;
};
function computePaths(remainingTime: number) {
    console.log('Time left', remainingTime); // TODO: seb remove <------------
    const paths: Path[] = [
        {
            currValve: 'AA',
            activeNodes: getActiveValves().map((v) => v.name),
            remainingTime,
            finished: false,
            steps: [],
            releasedPressure: 0,
        },
    ];

    let max = 0;

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        if (path.remainingTime <= 0) path.finished = true;
        if (path.finished) continue;

        const distances = getDistanceMap(path.currValve);
        let moved = false;

        for (const active of path.activeNodes) {
            if (active === path.currValve) continue;
            if (path.remainingTime - distances[active] <= 1) continue;
            moved = true;

            const pathRemainingTime = path.remainingTime - distances[active] - 1;

            paths.push({
                currValve: active,
                activeNodes: path.activeNodes.filter((v) => v !== active),
                remainingTime: pathRemainingTime,
                finished: false,
                steps: [...path.steps, active],
                releasedPressure:
                    path.releasedPressure + pathRemainingTime * valvesByName[active].flowRate,
            });
        }

        if (!moved) path.finished = true;
        if (path.finished && path.releasedPressure > max) max = path.releasedPressure;
    }

    return paths
        .filter((path) => path.finished)
        .sort((a, b) => b.releasedPressure - a.releasedPressure);
}

const paths = computePaths(30);
console.log(paths[0]); // TODO: seb remove <------------
