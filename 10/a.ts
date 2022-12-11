export {};

const ADD_X_CYCLES = 2;

const input = await Deno.readTextFile('./input.txt');

const operations = input.split('\n');
const regHistory = [1];

function getLastRegValue() {
    return regHistory[regHistory.length - 1];
}

for (const operation of operations) {
    if (operation === 'noop') {
        regHistory.push(getLastRegValue());
        continue;
    }

    const currRegVal = getLastRegValue();
    const [op, strAmount] = operation.split(' ');
    const amount = parseInt(strAmount);

    // Fill in our blank cycle since addx takes 2 cycles
    Array(ADD_X_CYCLES - 1)
        .fill(null)
        .forEach(() => regHistory.push(currRegVal));

    regHistory.push(currRegVal + amount);
}

const cyclesToCheck = [20, 60, 100, 140, 180, 220];
const totalSignalStrength = cyclesToCheck.reduce((total, cycle) => {
    return total + regHistory[cycle - 1] * cycle;
}, 0);

console.log(totalSignalStrength);
