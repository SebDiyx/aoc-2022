export {};

const input = await Deno.readTextFile('./input.txt');

const treeHeights = input.split('\n').map((line) => {
    return line.split('').map((treeHeight) => parseInt(treeHeight));
});

let highestScenicScore = 0;
treeHeights.forEach((row, rowIdx) => {
    row.forEach((currTree, colIdx) => {
        let leftScenicScore = 0;
        let rightScenicScore = 0;
        let aboveScenicScore = 0;
        let belowScenicScore = 0;

        // Left from curr tree
        const treesLeftOf = treeHeights[rowIdx].slice(0, colIdx);
        for (const tree of treesLeftOf.reverse()) {
            leftScenicScore++;
            if (tree >= currTree) break;
        }

        // Visible from Right
        const treesRightOf = treeHeights[rowIdx].slice(colIdx + 1);
        for (const tree of treesRightOf) {
            rightScenicScore++;
            if (tree >= currTree) break;
        }

        // Visible from Top
        const treesAbove = treeHeights.slice(0, rowIdx).map((row) => row[colIdx]);
        for (const tree of treesAbove.reverse()) {
            aboveScenicScore++;
            if (tree >= currTree) break;
        }

        // Visible from Bottom
        const treesBelow = treeHeights.slice(rowIdx + 1).map((row) => row[colIdx]);
        for (const tree of treesBelow) {
            belowScenicScore++;
            if (tree >= currTree) break;
        }

        const scenicScore =
            leftScenicScore * rightScenicScore * aboveScenicScore * belowScenicScore;
        if (scenicScore > highestScenicScore) highestScenicScore = scenicScore;
    });
});

console.log(highestScenicScore); // TODO: seb remove <------------
