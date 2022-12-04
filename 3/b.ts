export {};

const input = await Deno.readTextFile('./input.txt');
const rucksacks = input.split('\n');
const elfGroups = [];
while (rucksacks.length > 0) {
    elfGroups.push(rucksacks.splice(0, 3));
}

const duplicates = [];
for (const elfGroup of elfGroups) {
    const [elf1, elf2, elf3] = elfGroup;
    const currDuplicates: string[] = [];
    for (const letter of elf1) {
        if (!currDuplicates.includes(letter) && elf2.includes(letter) && elf3.includes(letter)) {
            currDuplicates.push(letter);
        }
    }
    duplicates.push(...currDuplicates);
}

function letterToPriority(str: string) {
    // Handle lower case
    // 'a'.charCodeAt(0) = 97, so to get a = 1 we take 96
    if (str[0] === str[0].toLowerCase()) return str.charCodeAt(0) - 96;

    // 'A'.charCodeAt(0) = 65, so to get A = 27 we take 38
    if (str[0] === str[0].toUpperCase()) return str.charCodeAt(0) - 38;

    return 0;
}
const totalPriority = duplicates.reduce((acc, letter) => acc + letterToPriority(letter), 0);

console.log(totalPriority);
