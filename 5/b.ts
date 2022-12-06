export {};

const input = await Deno.readTextFile('./input.txt');
const [cratesInput, instructionsInput] = input.split('\n\n');

function breakIntoColumns(line: string): string[] {
    const columns = [];
    for (let idx = 0; idx < line.length; idx = idx + 4) {
        columns.push(line.slice(idx, idx + 4).trim());
    }
    return columns;
}

const cratesState: string[][] = new Array(9).fill(null).map(() => []);

cratesInput
    .split('\n')
    .slice(0, -1) // Remove the line containing the column numbers
    .reverse()
    .forEach((line) => {
        const lineColumns = breakIntoColumns(line);

        lineColumns.forEach((crate, columnIdx) => {
            if (crate !== '') {
                const cleanCrate = crate.replace('[', '').replace(']', '');

                const column = cratesState[columnIdx];
                column.push(cleanCrate);
            }
        });
    });

const instructions = instructionsInput.split('\n').map((line) => {
    // num, start, end
    return line
        .replace('move ', '')
        .replace('from ', '')
        .replace('to ', '')
        .split(' ')
        .map((num) => parseInt(num, 10));
});

for (const instruction of instructions) {
    const [num, startCol, endCol] = instruction;

    const crates = cratesState[startCol - 1].splice(-num);
    cratesState[endCol - 1].push(...crates);
}

const answer = cratesState.map((column) => column[column.length - 1]).join('');
console.log(answer);
