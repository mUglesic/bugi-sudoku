
const SUDOKU_GRID = document.getElementById("sudoku");

const DIMX = 3;
const DIMY = 3;

for (let i = 0; i < Math.pow(DIMX * DIMY, 2); i++) {

    const field = document.createElement("div");
    field.id = `field-${i}`
    field.className = "sudokuField";

    SUDOKU_GRID.append(field);

}
