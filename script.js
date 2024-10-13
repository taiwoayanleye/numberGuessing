// Game configuration
const CONFIG = {
  minRange: Number(document.querySelector("#minRange").textContent),
  maxRange: Number(document.querySelector("#maxRange").textContent),
  maxGuesses: 5,
};

// DOM Elements
const elements = {
  splashScreen: document.querySelector("#splashScreen"),
  gameScreen: document.querySelector("#gameScreen"),
  difficultyBtns: document.querySelector("#difficultyBtns"),
  guessField: document.querySelector("#guessField"),
  submitBtn: document.querySelector("#submitBtn"),
  cancelBtn: document.querySelector("#cancelBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  statusMsg: document.querySelector("#statusMsg"),
  lowOrHigh: document.querySelector("#lowOrHigh"),
  inputBtns: document.querySelector("#inputBtns"),
};

// Audio Files
const audioFiles = {
  clickNumbers: new Audio("audio/click-numbers.mp3"),
  clickSubmitBtns: new Audio("audio/click-submit.mp3"),
  win: new Audio("audio/win.mp3"),
  between: new Audio("audio/between.mp3"),
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

// Switch screens
function switchScreens(event) {
  if (event.target.tagName === "BUTTON") {
    elements.splashScreen.classList.toggle("hidden");
    elements.gameScreen.classList.toggle("hidden");
  }
}

// User can enter their guess by click on the number buttons
function enterGuess(event) {
  if (gameState.isGameOver) return;

  if (event.target.tagName === "BUTTON") {
    gameState.currentGuess += event.target.textContent;
    const audioFile = audioFiles.clickNumbers;

    if (Number(gameState.currentGuess) <= CONFIG.maxRange) {
      elements.guessField.value = gameState.currentGuess;
      playAudio(audioFile);
    } else {
      gameState.currentGuess = gameState.currentGuess.slice(0, -1);
    }
  }
}

// Compare users's guess with random number
function checkGuess() {
  if (gameState.isGameOver || gameState.currentGuess === "") return;

  const guess = Number(gameState.currentGuess);
  const audioFile = audioFiles.clickSubmitBtns;
  gameState.remainingGuesses--;

  if (guess === gameState.randomNumber) {
    gameWin();
  } else if (gameState.remainingGuesses === 0) {
    gameOver();
  } else {
    isLowOrHigh(guess);
  }
  clearGuesses();
  playAudio(audioFile);
}

// User can clear their guess
function clearGuesses() {
  const audioFile = audioFiles.clickSubmitBtns;
  gameState.currentGuess = "";
  elements.guessField.value = "";
  playAudio(audioFile);
}

function gameWin() {
  const audioFile = audioFiles.win;
  setStatusMessage("You got it!!!", "text-green");
  elements.lowOrHigh.textContent = `You got it  in ${
    CONFIG.maxGuesses - gameState.remainingGuesses
  } tries!`;
  playAudio(audioFile);
  endGame();
}

// LowOrHigh
function isLowOrHigh(guess) {
  const audioFile = audioFiles.between;
  const isLow = guess < gameState.randomNumber;
  const message = isLow
    ? "Your last guess was too low!"
    : "Your last guess was too high!";
  elements.lowOrHigh.textContent = `Wrong!!! ${message}`;

  const rangeElement = isLow ? minRange : maxRange;
  const startValue = Number(rangeElement.textContent);
  animateCounter(rangeElement, startValue, guess);
  playAudio(audioFile);

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

function playAudio(audio) {
  console.log(`Play audio ${audio}`);
  audio.play();
}

elements.difficultyBtns.addEventListener("click", switchScreens);
elements.inputBtns.addEventListener("click", enterGuess);
elements.submitBtn.addEventListener("click", checkGuess);
elements.cancelBtn.addEventListener("click", clearGuesses);
elements.restartBtn.addEventListener("click", restartGame);

// Initialize
updateGuessCount();
