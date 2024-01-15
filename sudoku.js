
const NUMS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const DIFF = {
    DEBUG: {minRemoved: 1, maxRemoved: 7},
    EASY: {minRemoved: 40, maxRemoved: 45},
    MEDIUM: {minRemoved: 46, maxRemoved: 52},
    HARD: {minRemoved: 53, maxRemoved: 57}
}

const DIFF_MAP = [DIFF.EASY, DIFF.MEDIUM, DIFF.HARD];

class Sudoku {

    constructor(w, h, d) {

        this.xDim = w;
        this.yDim = h;

        this.size = this.xDim * this.yDim;

        this.solutionCounter = 0;

        this.grid = this.createGrid(this.size);
        this.generatePuzzle();

        this.solvedGrid = this.copyGrid();

        this.removeNums(DIFF_MAP[d]);

        this.fixedNums = this.createFixed();

    }

    insertNumber(n, i, j) {

        if (!this.isFixed(i, j)) {
            this.grid[i][j] = n;
        }

    }

    isFixed(i, j) {
        return this.fixedNums[i][j];
    }

    isWon() {

        for (let i = 0; i < this.size; i++) {

            for (let j = 0; j < this.size; j++) {

                if (this.grid[i][j] !== this.solvedGrid[i][j]) {
                    return false;
                }

            }

        }

        this.fixedNums = this.createFixed();

        return true;

    }

    createGrid(size) {

        let grid = [];

        for (let i = 0; i < size; i++) {

            let l = grid.push([]);

            for (let j = 0; j < size; j++) {

                grid[l - 1].push("");

            }

        }

        return grid;

    }

    copyGrid() {

        let newGrid = [];

        for (let i = 0; i < this.size; i++) {
            newGrid.push([]);
            for (let j = 0; j < this.size; j++) {
                newGrid[i].push(this.grid[i][j]);
            }
        }

        return newGrid;

    }

    createFixed() {

        let fixed = [];

        for (let i = 0; i < this.size; i++) {
            fixed.push([]);
            for (let j = 0; j < this.size; j++) {
                fixed[i].push((this.grid[i][j] === "") ? false : true);
            }
        }

        return fixed;

    }

    generatePuzzle() {

        let b = false;
        let iLast = 0;
        let jLast = 0;

        for (let i = 0; i < this.size; i++) {

            for (let j = 0; j < this.size; j++) {

                if (this.grid[i][j] === "") {

                    let numsCopy = [...NUMS];

                    shuffleArray(numsCopy);

                    for (let num of numsCopy) {

                        if (!this.checkRow(num, i) && !this.checkCol(num, j) && !this.checkSquare(num, i, j)) {

                            this.grid[i][j] = num;

                            if (this.checkGrid()) {
                                return true;
                            }
                            else if (this.generatePuzzle()) {
                                return true;
                            }

                        }

                    }

                    b = true;
                    iLast = i;
                    jLast = j;
                    break;

                }

            }

            if (b) break;

        }

        this.grid[iLast][jLast] = "";

    }

    solvePuzzle(grid) {

        let b = false;
        let iLast = 0;
        let jLast = 0;

        for (let i = 0; i < this.size; i++) {

            for (let j = 0; j < this.size; j++) {

                if (grid[i][j] === "") {

                    for (let num of NUMS) {

                        if (!this.checkRow(num, i, grid) && !this.checkCol(num, j, grid) && !this.checkSquare(num, i, j, grid)) {

                            grid[i][j] = num;

                            if (this.checkGrid(grid)) {
                                this.solutionCounter++;
                                break;
                            }
                            else if (this.solvePuzzle(grid)) {
                                return true;
                            }

                        }

                    }

                    b = true;
                    iLast = i;
                    jLast = j;
                    break;

                }

            }

            if (b) break;

        }

        grid[iLast][jLast] = "";

    }

    removeNums(difficulty) {

        let minRemoved = difficulty.minRemoved;
        let maxRemoved = difficulty.maxRemoved;

        let notEmpty = [];

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                notEmpty.push({i, j});
            }
        }

        shuffleArray(notEmpty);

        while (true) {

            if (this.countEmpty() >= minRemoved) {
                if (Math.random() > 0.75) {
                    break;
                }
            }

            const randomField = notEmpty.pop();

            const randomRow = randomField.i;
            const randomCol = randomField.j;

            let currentVal = this.grid[randomRow][randomCol];
            this.grid[randomRow][randomCol] = "";

            let cGrid = this.copyGrid();

            this.solutionCounter = 0;
            this.solvePuzzle(cGrid);

            if (this.solutionCounter != 1) {

                this.grid[randomRow][randomCol] = currentVal;
                continue;

            }

            if (this.countEmpty() >= maxRemoved) {
                break;
            }

        }

        console.log(this.countEmpty())

    }

    countEmpty() {

        let counter = 0;

        for (let row of this.grid) {
            for (let square of row) {
                if (square === "") {
                    counter++;
                }
            }
        }

        return counter;

    }

    checkGrid(grid = this.grid) {

        for (let row of grid) {

            for (let square of row) {

                if (square === "") {
                    return false;
                }

            }

        }

        return true;

    }

    checkRow(val, index, grid = this.grid) {
        
        for (let v of grid[index]) {

            if (val === v) {
                return true;
            }

        }

        return false;
    }

    checkCol(val, index, grid = this.grid) {

        for (let i = 0; i < this.size; i++) {

            if (val === grid[i][index]) {
                return true;
            }

        }

        return false;

    }

    checkSquare(val, row, col, grid = this.grid) {

        let iSq = Math.floor(row / this.xDim) * this.xDim;
        let jSq = Math.floor(col / this.yDim) * this.yDim;

        for (let i = 0; i < this.xDim; i++) {

            for (let j = 0; j < this.yDim; j++) {

                if (val === grid[iSq + i][jSq + j]) {
                    return true;
                }

            }

        }

        return false;

    }

}

function shuffleArray(arr) {

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

}