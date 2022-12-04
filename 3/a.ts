export {};

const input = await Deno.readTextFile('./input.txt');

// Split our input into rucksacks and their two compartments
const rucksacks = input.split('\n').map((rucksack) => {
    // Find the half way point
    const half = Math.ceil(rucksack.length / 2);

    // Split our rucksack into its two halves
    return [rucksack.slice(0, half), rucksack.slice(half)];
});

// Find all non repeating duplicates for each rucksack
const duplicates = [];
for (const rucksack of rucksacks) {
    // Split our rucksack into its two compartments
    const [comp1, comp2] = rucksack;
    const currDuplicates: string[] = [];
    for (const letter of comp1) {
        // Check if the current letter appears in the second compartment and if we haven't already find it
        if (!currDuplicates.includes(letter) && comp2.includes(letter)) {
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
