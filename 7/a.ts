export {};

const input = await Deno.readTextFile('./input.txt');

type File = {
    type: 'file';
    name: string;
    size: number;
};

type Dir = {
    type: 'dir';
    name: string;
    parent: Dir | null; //Only null for root dir
    children: (Dir | File)[];
};

const rootDir: Dir = {
    type: 'dir',
    name: '/',
    parent: null,
    children: [],
};
let currDir: Dir = rootDir;

function addNewFile(name: string, size: number) {
    const newFile: File = {
        type: 'file',
        name,
        size,
    };
    currDir.children.push(newFile);
}

function addNewDir(name: string) {
    const newDir: Dir = {
        type: 'dir',
        name,
        parent: currDir,
        children: [],
    };
    currDir.children.push(newDir);
}

for (const line of input.split('\n')) {
    // Ignore ls command - doesn't give us any info
    if (line.startsWith('$ ls')) continue;

    // Handle cd command
    if (line.startsWith('$ cd')) {
        const [_, dir] = line.split('$ cd ');

        if (dir === '/') {
            currDir = rootDir;
        } else if (dir === '..' && currDir.parent) {
            currDir = currDir.parent as Dir;
        } else {
            const nextDir = currDir.children.find(
                (file) => file.type === 'dir' && file.name === dir,
            ) as Dir;
            if (nextDir) currDir = nextDir;
        }
        continue;
    }

    // Handle dir found
    if (line.startsWith('dir')) {
        const [_, name] = line.split('dir ');
        const dirExists = currDir.children.some(
            (fileOrDir) => fileOrDir.type === 'dir' && fileOrDir.name === name,
        );

        if (!dirExists) addNewDir(name);
        continue;
    }

    // Handle file found
    const [size, name] = line.split(' ');

    const fileExists = currDir.children.some(
        (fileOrDir) => fileOrDir.type === 'file' && fileOrDir.name === name,
    );

    if (!fileExists) addNewFile(name, parseInt(size));
}

function printDir(dir: Dir, depth = 0) {
    const dirPadding = ' '.repeat(depth * 4);
    const filePadding = ' '.repeat(depth * 4 + 2);
    console.log(`${dirPadding} - ${dir.name} (${getTotalFileSizesForDir(dir)})`);
    for (const child of dir.children) {
        if (child.type === 'dir') printDir(child, depth + 1);
        if (child.type === 'file') console.log(`${filePadding} + ${child.name} - ${child.size}`); // TODO: seb remove <------------
    }
}

function getTotalFileSizesForDir(dir: Dir) {
    const total: number = dir.children.reduce((total, child) => {
        if (child.type === 'dir') {
            return total + getTotalFileSizesForDir(child);
        } else {
            return total + child.size;
        }
    }, 0);

    return total;
}

let total = 0;
function addCombinedDirSize(dir: Dir) {
    return dir.children.forEach((child) => {
        if (child.type === 'dir') {
            addCombinedDirSize(child);
            const dirSize = getTotalFileSizesForDir(child);
            if (dirSize <= 100000) {
                total += dirSize;
            }
        }
    });
}

// printDir(rootDir);

addCombinedDirSize(rootDir);

console.log(total);
