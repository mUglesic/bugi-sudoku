
const SUDOKU_GRID = document.getElementById("sudoku");
const BUTTONS = document.getElementsByClassName("numberButton");

const CLICK_AUDIO = new Audio("public/audio/switch29_short.ogg");

const DIMX = 3;
const DIMY = 3;

let sudoku;
let fields = [];

let numberSelection = "";
let fieldSelection = [0, 0];
let inputMode = 0;             // 0 - field first; 1 - number first

function newGame() {

    while (SUDOKU_GRID.firstChild) {
        SUDOKU_GRID.removeChild(SUDOKU_GRID.firstChild);
    }

    const diff = document.getElementById("difficulty").value;

    sudoku = new Sudoku(DIMX, DIMY, diff);

    for (let i = 0; i < sudoku.size; i++) {

        for (let j = 0; j < sudoku.size; j++) {

            const field = document.createElement("div");
            field.id = `field-${i}-${j}`;
            fields.push(field);

            const fieldValue = document.createElement("span");
            fieldValue.innerHTML = sudoku.grid[i][j];

            field.append(fieldValue);

            field.classList.add("sudokuField");
            if (j % 3 == 0) field.classList.add("sudokuFieldVerticalBorder");
            if (i % 3 == 0) field.classList.add("sudokuFieldHorizontalBorder");
            if (sudoku.isFixed(i, j)) field.classList.add("fixedField")

            SUDOKU_GRID.append(field);

            field.addEventListener("click", () => {

                CLICK_AUDIO.pause();
                CLICK_AUDIO.currentTime = 0;
                CLICK_AUDIO.play();

                if (inputMode == 1) {

                    sudoku.insertNumber(numberSelection, i, j);
                    fieldValue.innerHTML = sudoku.grid[i][j];

                    if (sudoku.solvedGrid[i][j] !== sudoku.grid[i][j]) {
                        fieldValue.style = "color: #A82323;";
                    }
                    else {
                        fieldValue.style = "";
                    }

                    if (sudoku.isWon()) {
                        wave();
                    }

                }
                else {

                    document.getElementById(`field-${fieldSelection[0]}-${fieldSelection[1]}`).classList.remove("selected");

                    fieldSelection = [i, j];
                    field.classList.add("selected");

                    paintNums(fieldValue.innerHTML);

                }

            });

        }

    }

}

function selectNum(n) {
    numberSelection = n;
}

function paintNums(n) {

    for (const f of fields) {

        f.classList.remove("painted");

    }

    if (n != "") {

        for (const f of fields) {

            if (f.textContent == n) {

                f.classList.add("painted");

            }

        }

    }

}

document.addEventListener("keydown", (e) => {

    if (e.key === "Backspace" || e.key === " " || e.key === "0") {
        BUTTONS[BUTTONS.length - 1].click();
    }
    else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
        document.getElementById(`button-${e.key}`).click();
    }
    
});

document.getElementById("inputMode").addEventListener("change", (e) => {

    document.getElementById(`field-${fieldSelection[0]}-${fieldSelection[1]}`).classList.remove("selected");

    inputMode = e.target.value;

});

document.getElementById("startButton").addEventListener("click", () => {
    newGame();
});

for (let btn of BUTTONS) {

    btn.addEventListener("click", () => {

        const val = btn.textContent;

        selectNum(val == "␡" ? "" : val);

        if (inputMode == 0) {

            let i = fieldSelection[0];
            let j = fieldSelection[1];

            let fieldValue = document.getElementById(`field-${i}-${j}`).firstChild;

            sudoku.insertNumber(numberSelection, i, j);
            fieldValue.innerHTML = sudoku.grid[i][j];

            paintNums(numberSelection);

            if (sudoku.solvedGrid[i][j] !== sudoku.grid[i][j]) {
                fieldValue.style = "color: #A82323;";
            }
            else {
                fieldValue.style = "";
            }

            if (sudoku.isWon()) {
                wave();
            }

        }

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
