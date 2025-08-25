const sentences = [
  "Practice makes progress, not perfection.",
  "JavaScript adds life to the web.",
  "Focus on clarity before cleverness.",
  "CSS is the paint and layout of the web.",
  "Consistency beats intensity over time.",
  "Debugging is like being a detective in a crime movie where you are also the murderer.",
  "Simplicity is the soul of efficiency.",
  "Ship small, learn fast, iterate often.",
  "Good code is its own best documentation.",
  "Premature optimization is the root of all evil."
];

const target = document.getElementById("target");
const input = document.getElementById("typing");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const timeVal = document.getElementById("timeVal");
const wpmVal = document.getElementById("wpmVal");
const accVal = document.getElementById("accVal");
const errVal = document.getElementById("errVal");
const durationSel = document.getElementById("duration");

let testActive = false, startTime = 0, timerId = null, remaining = 0;
let currentSentence = "", prevInputLen = 0;
let totalTyped = 0, correctChars = 0;

function renderTarget(sentence, typed = "") {
  const spans = [...sentence].map((ch, i) => {
    let cls = "";
    if (i < typed.length) cls = (typed[i] === ch) ? "correct" : "incorrect";
    else if (i === typed.length) cls = "current";
    return `<span class="${cls}">${ch === " " ? "&nbsp;" : ch}</span>`;
  }).join("");
  target.innerHTML = spans;
}

function sampleSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function loadNewSentence() {
  currentSentence = sampleSentence();
  renderTarget(currentSentence, "");
  input.value = "";
  prevInputLen = 0;
}

function updateStats() {
  const now = Date.now();
  const elapsedMin = Math.max((now - startTime), 1) / 60000;
  const wpm = Math.round((correctChars / 5) / elapsedMin);
  const accuracy = totalTyped ? Math.round((correctChars / totalTyped) * 100) : 100;

  wpmVal.textContent = wpm;
  accVal.textContent = accuracy + "%";

 errVal.textContent = Math.max(0, totalTyped - correctChars);

}

function tick() {
  remaining -= 0.1;
  if (remaining <= 0) finishTest();
  else timeVal.textContent = remaining.toFixed(1) + "s";
}

function startTest() {
  if (testActive) return;
  testActive = true;
  totalTyped = 0;
  correctChars = 0;
  loadNewSentence();
  input.disabled = false;
  input.focus();
  startTime = Date.now();
  remaining = parseInt(durationSel.value, 10);
  timeVal.textContent = remaining.toFixed(1) + "s";
  wpmVal.textContent = "0";
  accVal.textContent = "100%";
  errVal.textContent = "0";
  timerId = setInterval(tick, 100);
}

function finishTest() {
  clearInterval(timerId);
  timerId = null;
  testActive = false;
  input.disabled = true;
  timeVal.textContent = "0.0s";
}

input.addEventListener("input", () => {
  if (!testActive) return;
  const typed = input.value;
  const currLen = typed.length;

  if (currLen > prevInputLen) totalTyped++;
  prevInputLen = currLen;

  let correctSoFar = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentSentence[i]) correctSoFar++;
  }
  correctChars += (correctSoFar - correctChars < 0 ? 0 : correctSoFar);
  renderTarget(currentSentence, typed);
  updateStats();

  if (typed === currentSentence) loadNewSentence();
});

startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", () => location.reload());
nextBtn.addEventListener("click", () => {
  if (testActive) loadNewSentence();
});
