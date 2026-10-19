
const currentValue = document.querySelector(".current-value");
const previousValue = document.querySelector(".previous-value");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "";
let previousInput = "";
let operator = "";
let justCalculated = false;


// display

function updateDisplay() {
    currentValue.textContent = currentInput || "0";

    previousValue.textContent =
        previousInput !== "" && operator !== ""
            ? `${previousInput} ${operator}`
            : "";
}


// format result

function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}


// calculate

function calculate() {
    if (
        previousInput === "" ||
        currentInput === "" ||
        operator === ""
    ) {
        return false;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentInput = "Error";
                previousInput = "";
                operator = "";
                justCalculated = true;

                updateDisplay();
                return true;
            }

            result = firstNumber / secondNumber;
            break;

        case "%":
            if (secondNumber === 0) {
                currentInput = "Error";
                previousInput = "";
                operator = "";
                justCalculated = true;

                updateDisplay();
                return true;
            }

            result = firstNumber % secondNumber;
            break;

        default:
            return false;
    }

    currentInput = formatResult(result);
    previousInput = "";
    operator = "";
    justCalculated = true;

    updateDisplay();
    return true;
}


// enter number

function enterNumber(number) {
    if (currentInput === "Error" || justCalculated) {
        currentInput = "";
        justCalculated = false;
    }

    if (currentInput.length >= 16) {
        return;
    }

    currentInput += number;

    updateDisplay();
}


// enter decimal

function enterDecimal() {
    if (currentInput === "Error" || justCalculated) {
        currentInput = "";
        justCalculated = false;
    }

    if (currentInput.includes(".")) {
        return;
    }

    if (currentInput === "") {
        currentInput = "0";
    }

    currentInput += ".";

    updateDisplay();
}


// select operator

function selectOperator(nextOperator) {
    if (currentInput === "Error") {
        return;
    }

    // replace operator if second number hasn't been entered
    if (operator !== "" && currentInput === "") {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    // calculate pending operation first
    if (operator !== "" && previousInput !== "" && currentInput !== "") {
        calculate();

        if (currentInput === "Error") {
            return;
        }
    }

    if (currentInput === "") {
        return;
    }

    previousInput = currentInput;
    operator = nextOperator;
    currentInput = "";
    justCalculated = false;

    updateDisplay();
}


// toggle sign

function toggleSign() {
    if (currentInput === "" || currentInput === "Error") {
        return;
    }

    if (currentInput.startsWith("-")) {
        currentInput = currentInput.slice(1);
    } else {
        currentInput = "-" + currentInput;
    }

    justCalculated = false;
    updateDisplay();
}


// delete last character

function deleteLast() {
    if (currentInput === "Error" || justCalculated) {
        currentInput = "";
        justCalculated = false;
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}


// clear calculator

function clearCalculator() {
    currentInput = "";
    previousInput = "";
    operator = "";
    justCalculated = false;

    updateDisplay();
}


// handle button clicks

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();

        if (button.classList.contains("clear")) {
            clearCalculator();
            return;
        }

        if (button.classList.contains("delete")) {
            deleteLast();
            return;
        }

        if (button.classList.contains("equal")) {
            calculate();
            return;
        }

        if (value === "+/-") {
            toggleSign();
            return;
        }

        if (value === ".") {
            enterDecimal();
            return;
        }

        if (button.classList.contains("operator")) {
            selectOperator(value);
            return;
        }

        if (/^\d$/.test(value)) {
            enterNumber(value);
        }
    });
});


// keyboard support

document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^\d$/.test(key)) {
        enterNumber(key);
        return;
    }

    if (key === ".") {
        enterDecimal();
        return;
    }

    if (["+", "-", "*", "/", "%"].includes(key)) {
        selectOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
        return;
    }

    if (key === "Escape" || key === "Delete") {
        clearCalculator();
        return;
    }
});


// initial display

updateDisplay();
