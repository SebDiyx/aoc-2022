export {};

const input = await Deno.readTextFile('./input.txt');

const elfs: number[][] = [[]];
for (const line of input.split('\n')) {
    if (line === '') {
        elfs.push([]);
    } else {
        elfs[elfs.length - 1].push(parseInt(line));
    }
}

const elfTotalCals = elfs.map((elfCals) => elfCals.reduce((total, elfCals) => total + elfCals, 0));

const totalOfTop3 = elfTotalCals
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((total, elfCals) => total + elfCals, 0);

console.log(totalOfTop3);
