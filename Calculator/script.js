let display = document.getElementById("display");
let expression = "";

function appendToDisplay(value) {
    if (value === "0") {
        if (expression.length === 0) {
            return;
        }
        if (expression.slice(0) !== "0" || expression.includes(".")) {
            expression = expression;
        }
    }
    if (value === ".") {
        const lastNumber = expression.split(/[-+*/]/).pop();
        if (lastNumber.includes(".")) {
            return;
        }
        if (lastNumber.length === 0) {
            expression += "0"
        }
    }
    if (isOperator(value) && isOperator(expression.charAt(expression.length - 1))) {
        expression = expression.slice(0, -1) + value;
    } else {
        expression += value;
    }
    display.value = expression;
};

function calculate() {
    try {
        expression = eval(expression).toString();
        display.value = expression;
    } catch (error) {
        display.value = "Error";
    }
};

function clearDisplay() {
    expression = "";
    display.value = "0";
};

function isOperator(value) {
    return ["+", "-", "*", "/"].includes(value);
};

function backspace() {
    expression = expression.slice(0, -1);
    display.value = expression;
};