// ----- State: what the calculator remembers -----
let currentInput = "0";      // the number being typed
let previousInput = "";      // the number before the operator
let operator = null;         // the chosen operator (+, −, ×, ÷)
let shouldResetInput = false; // NEW: true when the next digit should start a fresh number
const ERROR_MSG = "Cannot divide by 0"; // NEW

// ----- Elements on the page -----
const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");

// ----- Show the state on screen -----
function updateDisplay() {
  currentEl.textContent = currentInput;
  previousEl.textContent = operator ? `${previousInput} ${operator}` : "";
}

// ----- Typing a number or decimal point -----
function appendNumber(num) {
  if (currentInput === ERROR_MSG) clearAll();            // NEW: leave the error state

  if (shouldResetInput) {                                // NEW: start a new number
    currentInput = num === "." ? "0." : num;
    shouldResetInput = false;
    updateDisplay();
    return;
  }

  if (num === "." && currentInput.includes(".")) return; // only one decimal point
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

// ----- NEW: choosing an operator -----
function chooseOperator(op) {
  if (currentInput === ERROR_MSG) return;

  // Two operators in a row: just replace the old one
  if (operator && shouldResetInput) {
    operator = op;
    updateDisplay();
    return;
  }

  // Chaining like 5 + 3 × ...: calculate the first part now
  if (operator && !shouldResetInput) {
    calculate();
    if (currentInput === ERROR_MSG) return;
  }

  operator = op;
  previousInput = currentInput;
  shouldResetInput = true;
  updateDisplay();
}

// ----- NEW: the = button -----
function calculate() {
  if (!operator || shouldResetInput) return; // nothing to calculate yet

  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷":
      if (b === 0) {                         // edge case: divide by zero
        currentInput = ERROR_MSG;
        previousInput = "";
        operator = null;
        shouldResetInput = true;
        updateDisplay();
        return;
      }
      result = a / b;
      break;
  }

  result = parseFloat(result.toFixed(10));   // fixes 0.1 + 0.2 = 0.30000000000000004
  currentInput = String(result);
  previousInput = "";
  operator = null;
  shouldResetInput = true;
  updateDisplay();
}

// ----- C button -----
function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetInput = false;
  updateDisplay();
}

// ----- ⌫ button -----
function deleteLast() {
  if (currentInput === ERROR_MSG) { clearAll(); return; }
  if (shouldResetInput) return;              // NEW: don't edit a finished result
  const isSingleDigit = currentInput.length === 1;
  const isNegativeSingle = currentInput.length === 2 && currentInput.startsWith("-");
  currentInput = (isSingleDigit || isNegativeSingle) ? "0" : currentInput.slice(0, -1);
  updateDisplay();
}

// ----- Connect the buttons to the functions -----
document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.dataset.number));
});

document.querySelectorAll("[data-operator]").forEach((button) => {   // NEW
  button.addEventListener("click", () => chooseOperator(button.dataset.operator));
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "clear") clearAll();
    if (action === "delete") deleteLast();
    if (action === "equals") calculate();                              // NEW
  });
});

updateDisplay();