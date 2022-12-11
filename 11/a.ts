export {};
type Monkey = {
    items: number[];
    numItemsInspected: number;
    operation: string;
    test: { divisibleBy: number; nextMonkey: { pass: number; fail: number } };
};

const input = await Deno.readTextFile('./input.txt');

const monkeys: Monkey[] = input.split('\n\n').map((monkey) => {
    const [_, startingItemsLine, operationLine, ...testLines] = monkey.split('\n');

    // Starting items
    const strStartingItems = startingItemsLine.split(': ')[1].split(', ');
    const items = strStartingItems.map((item) => parseInt(item));

    // Operation
    const operation = operationLine.split('Operation: new = ')[1];

    // Test
    const [divisibleByLine, passLine, failLine] = testLines;
    const divisibleBy = parseInt(divisibleByLine.split('divisible by ')[1]);
    const pass = parseInt(passLine.split('monkey ')[1]);
    const fail = parseInt(failLine.split('monkey ')[1]);

    return {
        items,
        numItemsInspected: 0,
        operation,
        test: {
            divisibleBy,
            nextMonkey: {
                pass,
                fail,
            },
        },
    };
});

function getNewWorryLevel(oldWorryLevel: number, operation: string) {
    const [_, symbol, strAmount] = operation.split(' ');

    const amount = strAmount === 'old' ? oldWorryLevel : parseInt(strAmount);

    if (symbol === '+') return oldWorryLevel + amount;
    if (symbol === '*') return oldWorryLevel * amount;

    return oldWorryLevel;
}

// Go through 20 rounds
Array(20)
    .fill(null)
    .forEach(() => {
        monkeys.forEach((monkey) => {
            const itemsCopy = [...monkey.items];
            itemsCopy.forEach((worryLevel) => {
                monkey.items.splice(0, 1);
                monkey.numItemsInspected++;

                let newWorryLevel = getNewWorryLevel(worryLevel, monkey.operation);

                newWorryLevel = Math.floor(newWorryLevel / 3);

                let nextMonkey;
                if (newWorryLevel % monkey.test.divisibleBy === 0) {
                    nextMonkey = monkeys[monkey.test.nextMonkey.pass];
                } else {
                    nextMonkey = monkeys[monkey.test.nextMonkey.fail];
                }
                nextMonkey.items.push(newWorryLevel);
            });
        });
    });

const monkeyBusiness = monkeys
    .sort((a, b) => b.numItemsInspected - a.numItemsInspected) // Sort monkeys on their activity level
    .slice(0, 2) // Take the 2 most active monkeys
    .reduce((total, monkey) => total * monkey.numItemsInspected, 1);

console.log(monkeyBusiness); // TODO: seb remove <------------
