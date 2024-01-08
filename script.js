
let currentSelection = "";

const SUDOKU_GRID = document.getElementById("sudoku");
const BUTTONS = document.getElementsByClassName("numberButton");

const DIMX = 3;
const DIMY = 3;

const sudoku = new Sudoku(DIMX, DIMY);

for (let i = 0; i < sudoku.size; i++) {

    for (let j = 0; j < sudoku.size; j++) {

        const field = document.createElement("div");
        field.id = `field-${i}-${j}`

        const fieldValue = document.createElement("span");
        fieldValue.innerHTML = sudoku.grid[i][j];

        field.append(fieldValue);

        field.classList.add("sudokuField");
        if (j % 3 == 0) field.classList.add("sudokuFieldVerticalBorder");
        if (i % 3 == 0) field.classList.add("sudokuFieldHorizontalBorder");
        if (sudoku.isFixed(i, j)) field.classList.add("fixedField")

        SUDOKU_GRID.append(field);

        field.addEventListener("click", () => {
            sudoku.insertNumber(currentSelection, i, j);
            fieldValue.innerHTML = sudoku.grid[i][j];
            fieldValue.style = `color: ${sudoku.solvedGrid[i][j] == sudoku.grid[i][j] ? "black" : "red"}`;
        });

    }

}

function selectNum(n) {
    currentSelection = n;
}

document.addEventListener("keydown", (e) => {

    if (e.key === "Backspace" || e.key === " ") {
        BUTTONS[BUTTONS.length - 1].click();
    }
    else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
        document.getElementById(`button-${e.key}`).click();
    }
    
});

for (let btn of BUTTONS) {

    btn.addEventListener("click", () => {

        const val = btn.innerHTML;

        selectNum(val);

        for (let b of BUTTONS) {
            b.classList.remove("numberButtonSelected");
        }

        btn.classList.add("numberButtonSelected");

    });

}
