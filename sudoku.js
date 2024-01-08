
const NUMS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const DIFF = {
    EASY: 3,
    MEDIUM: 8,
    HARD: 10
}

class Sudoku {

    constructor(w, h) {

        this.xDim = w;
        this.yDim = h;

        this.size = this.xDim * this.yDim;

        this.solutionCounter = 0;

        this.grid = this.createGrid(this.size);
        this.generatePuzzle();

        this.solvedGrid = this.copyGrid();

        this.removeNums(DIFF.MEDIUM);

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

    removeNums(attempts) {

        while (attempts > 0) {

            let randomRow, randomCol;

            do {
                randomRow = Math.floor(Math.random() * 9);
                randomCol = Math.floor(Math.random() * 9);
            } while(this.grid[randomRow][randomCol] === "");

            let currentVal = this.grid[randomRow][randomCol];
            this.grid[randomRow][randomCol] = "";

            let cGrid = this.copyGrid();

            this.solutionCounter = 0;
            this.solvePuzzle(cGrid);

            if (this.solutionCounter != 1) {

                this.grid[randomRow][randomCol] = currentVal;
                attempts--;

            }

        }

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