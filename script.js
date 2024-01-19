
let currentSelection = "";

const SUDOKU_GRID = document.getElementById("sudoku");
const BUTTONS = document.getElementsByClassName("numberButton");

const CLICK_AUDIO = new Audio("/public/audio/switch29.ogg");

const DIMX = 3;
const DIMY = 3;

let sudoku;

function newGame() {

    while (SUDOKU_GRID.firstChild) {
        SUDOKU_GRID.removeChild(SUDOKU_GRID.firstChild);
    }

    const diff = document.getElementById("difficulty").value;

    sudoku = new Sudoku(DIMX, DIMY, diff);

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
                CLICK_AUDIO.play();
                sudoku.insertNumber(currentSelection, i, j);
                fieldValue.innerHTML = sudoku.grid[i][j];
                if (sudoku.solvedGrid[i][j] !== sudoku.grid[i][j]) {
                    fieldValue.style = "color: red;";
                }
                else {
                    fieldValue.style = "";
                }
                if (sudoku.isWon()) {
                    wave();
                }
            });

        }

    }

}

function selectNum(n) {
    currentSelection = n;
}

document.addEventListener("keydown", (e) => {

    if (e.key === "Backspace" || e.key === " " || e.key === "0") {
        BUTTONS[BUTTONS.length - 1].click();
    }
    else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
        document.getElementById(`button-${e.key}`).click();
    }
    
});

document.getElementById("startButton").addEventListener("click", () => {
    newGame();
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

function wave() {

    SUDOKU_GRID.style = "border: none;";

    setTimeout(() => {
        SUDOKU_GRID.style = "";
    }, 1800);

    let i = 0;

    for (let f of document.getElementsByClassName("sudokuField")) {
        f.style = `animation: 1s ease-in-out ${i}ms wave;`;
        i += 10;
    }

}
