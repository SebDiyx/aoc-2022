export {}

// A, X === Rock -> 1
// B, Y === Paper -> 2
// C, Z === Scissors -> 3

type OppMoves = "A" | "B" | "C"
type Outcomes = "X" | "Y" | "Z"

const input = await Deno.readTextFile("./input.txt");
const rounds = input.split("\n").map((round)=> round.split(" ")) as [OppMoves, Outcomes][]

const moveScoreMap = {
    A: 1,
    B: 2,
    C: 3,
}

const outcomeScoreMap = {
    X: 0,
    Y: 3,
    Z: 6,
}

const winMoveMap: {[key in OppMoves]: OppMoves} = {
    A: "B",
    B: "C",
    C: "A"
}

const drawMoveMap: {[key in OppMoves]: OppMoves} = {
    A: "A",
    B: "B",
    C: "C"
}

const lossMoveMap: {[key in OppMoves]: OppMoves} = {
    A: "C",
    B: "A",
    C: "B"
}

let total = 0;
for(const round of rounds) {

    const [them, outcome] = round;

    // Add the outcome to the total
    total += outcomeScoreMap[outcome]

    if(outcome === "X") total += moveScoreMap[lossMoveMap[them]];
    if(outcome === "Y") total += moveScoreMap[drawMoveMap[them]];
    if(outcome === "Z") total += moveScoreMap[winMoveMap[them]]
}

console.log(total); 