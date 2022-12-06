export {};

const input = await Deno.readTextFile('./input.txt');

// Searching for 4 non repeating chars

for (let ii = 14; ii <= input.length; ii++) {
    const group = input.slice(ii - 14, ii);

    let isSignal = true;
    for (const char of group) {
        if (group.lastIndexOf(char) !== group.indexOf(char)) {
            isSignal = false;
            break;
        }
    }

    if (isSignal) {
        console.log(ii);
        break;
    }
}
