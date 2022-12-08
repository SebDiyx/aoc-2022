export {};

const input = await Deno.readTextFile('./input.txt');

const treeHeights = input.split('\n').map((line) => {
    return line.split('').map((treeHeight) => parseInt(treeHeight));
});

let visibleTrees = 0;
treeHeights.forEach((row, rowIdx) => {
    row.forEach((currTree, colIdx) => {
        // Curr tree is at the top or the bottom of the grid (thus on the outside - so visible)
        if (rowIdx === 0 || rowIdx === treeHeights.length - 1) {
            visibleTrees++;
            return;
        }

        // Curr tree is at the start or the end of a row (thus on the outside - so visible)
        if (colIdx === 0 || colIdx === treeHeights[rowIdx].length - 1) {
            visibleTrees++;
            return;
        }

        // Visible from Left
        const treesLeftOf = treeHeights[rowIdx].slice(0, colIdx);
        if (treesLeftOf.every((tree) => tree < currTree)) {
            visibleTrees++;
            return;
        }

        // Visible from Right
        const treesRightOf = treeHeights[rowIdx].slice(colIdx + 1);
        if (treesRightOf.every((tree) => tree < currTree)) {
            visibleTrees++;
            return;
        }

        // Visible from Top
        const treesAbove = treeHeights.slice(0, rowIdx).map((row) => row[colIdx]);
        if (treesAbove.every((tree) => tree < currTree)) {
            visibleTrees++;
            return;
        }

        // Visible from Bottom
        const treesBelow = treeHeights.slice(rowIdx + 1).map((row) => row[colIdx]);
        if (treesBelow.every((tree) => tree < currTree)) {
            visibleTrees++;
            return;
        }
    });
});

console.log(visibleTrees); // TODO: seb remove <------------
