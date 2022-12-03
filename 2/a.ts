export {}

// A, X === Rock -> 1
// B, Y === Paper -> 2
// C, Z === Scissors -> 3

type OppMoves = "A" | "B" | "C"
type YourMoves = "X" | "Y" | "Z"
 
const input = await Deno.readTextFile("./input.txt");
const rounds = input.split("\n").map((round)=> round.split(" ")) as [OppMoves, YourMoves][]


const moveLookUp: {[key in YourMoves]: OppMoves} = {
    X: "A",
    Y: "B",
    Z: "C",
}

const strategyScoreMap = {
    X: 1,
    Y: 2,
    Z: 3,
}

let total = 0;
for(const round of rounds) {
    const [them, me] = round;

    let roundCount = strategyScoreMap[me];

    const translatedMe = moveLookUp[me];
    if(them === translatedMe) roundCount += 3;
    if(them === "A" && translatedMe === "B") roundCount += 6;
    if(them === "B" && translatedMe === "C") roundCount += 6;
    if(them === "C" && translatedMe === "A") roundCount += 6;

    total += roundCount;
}

console.log(total); 