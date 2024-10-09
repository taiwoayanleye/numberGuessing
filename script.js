// Game configuration
const CONFIG = {
  minRange: Number(document.querySelector("#minRange").textContent),
  maxRange: Number(document.querySelector("#maxRange").textContent),
  maxGuesses: 5,
};

// DOM Elements
const elements = {
  guessField: document.querySelector("#guessField"),
  submitBtn: document.querySelector("#submitBtn"),
  cancelBtn: document.querySelector("#cancelBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  statusMsg: document.querySelector("#statusMsg"),
  lowOrHigh: document.querySelector("#lowOrHigh"),
  inputBtns: document.querySelector("#inputBtns"),
};

// Game states
const gameState = {
  randomNumber: Math.floor(
    Math.random() * (CONFIG.maxRange - CONFIG.minRange + 1) + CONFIG.minRange
  ),
  currentGuess: "",
  remainingGuesses: CONFIG.maxGuesses,
  isGameOver: false,
};

// User can enter their guess by click on the number buttons
function enterGuess(event) {
  if (gameState.isGameOver) return;

  if (event.target.tagName === "BUTTON") {
    gameState.currentGuess += event.target.textContent;

    if (Number(gameState.currentGuess) <= CONFIG.maxRange) {
      elements.guessField.value = gameState.currentGuess;
    } else {
      gameState.currentGuess = gameState.currentGuess.slice(0, -1);
    }
  }
}

// Compare users's guess with random number
function checkGuess() {
  if (gameState.isGameOver || gameState.currentGuess === "") return;

  const guess = Number(gameState.currentGuess);
  gameState.remainingGuesses--;

  if (guess === gameState.randomNumber) {
    gameWin();
  } else if (gameState.remainingGuesses === 0) {
    gameOver();
  } else {
    isLowOrHigh(guess);
  }
  clearGuesses();
}

// User can clear their guess
function clearGuesses() {
  gameState.currentGuess = "";
  elements.guessField.value = "";
}

function gameWin() {
  setStatusMessage("You got it!!!", "text-green");
  elements.lowOrHigh.textContent = `You got it  in ${
    CONFIG.maxGuesses - gameState.remainingGuesses
  } tries!`;
  endGame();
}

// LowOrHigh
function isLowOrHigh(guess) {
  const isLow = guess < gameState.randomNumber;
  const message = isLow
    ? "Your last guess was too low!"
    : "Your last guess was too high!";
  elements.lowOrHigh.textContent = `Wrong!!! ${message}`;

  const rangeElement = isLow ? minRange : maxRange;
  const startValue = Number(rangeElement.textContent);
  animateCounter(rangeElement, startValue, guess);

  updateGuessCount();
  clearGuesses();
}

// Game over
function gameOver() {
  setStatusMessage("Game over!!!", "text-red");
  lowOrHigh.textContent = `The number was ${gameState.randomNumber}`;
  endGame();
}
// End game
function endGame() {
  gameState.isGameOver = true;
  elements.submitBtn.disabled = true;
  elements.submitBtn.classList.toggle("hidden");
  cancelBtn.classList.toggle("hidden");
  restartBtn.classList.toggle("hidden");
}

function setStatusMessage(message, className) {
  elements.statusMsg.textContent = message;
  elements.statusMsg.classList.add(className);
}

function updateGuessCount() {
  setStatusMessage(`Trials left: ${gameState.remainingGuesses}`);
}

function restartGame() {
  location.reload();
}

function animateCounter(element, start, end) {
  const duration = 1000;
  const steps = 50;
  const stepDuration = duration / steps;

  let current = start;
  let step = 0;

  const easeOutQuad = (t) => t * (2 - t);

  const animation = setInterval(() => {
    step++;
    const progress = step / steps;
    const easedProgress = easeOutQuad(progress);
    current = start + (end - start) * easedProgress;

    element.textContent = Math.round(current).toLocaleString();
    element.style.color = `hsl(${120 * (1 - progress)}, 100%, 50%)`;

    if (step >= steps) {
      clearInterval(animation);
      element.textContent = end.toLocaleString();
      element.style.color = "";
    }
  }, stepDuration);
}

elements.inputBtns.addEventListener("click", enterGuess);
elements.submitBtn.addEventListener("click", checkGuess);
elements.cancelBtn.addEventListener("click", clearGuesses);
elements.restartBtn.addEventListener("click", restartGame);

// Initialize
updateGuessCount();
