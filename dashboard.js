// --- LOADER ---
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.style.display = "none", 1200);
});

// --- PLAYER STATS SYSTEM ---
let xp = 0;
let level = 1;
let energy = 100;
const xpMax = 100;

const xpText = document.getElementById("xp");
const xpMaxText = document.getElementById("xp-max");
const levelText = document.getElementById("level");
const energyText = document.getElementById("energy");
const xpFill = document.getElementById("xp-fill");
const levelUpText = document.getElementById("level-up-text");

function updateStats() {
  xpText.innerText = xp;
  levelText.innerText = level;
  energyText.innerText = energy;
  xpFill.style.width = `${(xp / xpMax) * 100}%`;
}

function showLevelUp() {
  levelUpText.style.opacity = "1";
  setTimeout(() => (levelUpText.style.opacity = "0"), 1500);
}

// --- TASK SYSTEM ---
const addTaskBtn = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
const taskXPInput = document.getElementById("task-xp");
const missionList = document.getElementById("mission-list");

addTaskBtn?.addEventListener("click", () => {
  const taskName = taskInput.value.trim();
  const taskXP = parseInt(taskXPInput.value);

  if (!taskName || isNaN(taskXP) || taskXP <= 0) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${taskName}</span>
    <button class="task-btn">Complete</button>
  `;

  const btn = li.querySelector(".task-btn");
  btn.addEventListener("click", () => {
    xp += taskXP;
    energy -= 5;
    if (xp >= xpMax) {
      xp -= xpMax;
      level++;
      energy = 100;
      showLevelUp();
    }
    updateStats();
    btn.disabled = true;
    btn.innerText = "✔ Done";
  });

  missionList.appendChild(li);
  taskInput.value = "";
  taskXPInput.value = "";
});

updateStats();

// --- TIMER SYSTEM ---
let timerInterval, remaining = 0, running = false;
const display = document.getElementById("display");

// ping sound for timer end
const pingAudio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function formatTime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

document.getElementById("start")?.addEventListener("click", () => {
  if (!running) {
    const mins = parseInt(document.getElementById("custom-minutes")?.value) || 0;
    const secs = parseInt(document.getElementById("custom-seconds")?.value) || 0;
    if (remaining === 0) remaining = mins * 60 + secs;
    if (remaining <= 0) return;
    running = true;
    timerInterval = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        display.textContent = formatTime(remaining);
      } else {
        clearInterval(timerInterval);
        running = false;
        display.textContent = "00:00:00";
        // play ping sound
        pingAudio.play();
      }
    }, 1000);
  }
});

document.getElementById("pause")?.addEventListener("click", () => {
  clearInterval(timerInterval);
  running = false;
});

document.getElementById("stop")?.addEventListener("click", () => {
  clearInterval(timerInterval);
  running = false;
  remaining = 0;
  display.textContent = "00:00:00";
});

// --- CALCULATOR ---
const calcDisplay = document.getElementById("calc-display");
document.querySelectorAll(".calc-btn")?.forEach(btn => {
  btn.addEventListener("click", () => calcDisplay.value += btn.textContent);
});
document.getElementById("calc-clear")?.addEventListener("click", () => calcDisplay.value = "");
document.getElementById("calc-equal")?.addEventListener("click", () => {
  try { calcDisplay.value = eval(calcDisplay.value) || ""; }
  catch { calcDisplay.value = "Error"; }
});

// --- NOTEPAD ---
const noteArea = document.getElementById("note-area");
const saveNote = document.getElementById("save-note");
const clearNote = document.getElementById("clear-note");

noteArea.value = localStorage.getItem("novaNote") || "";

saveNote?.addEventListener("click", () => {
  localStorage.setItem("novaNote", noteArea.value);
});

clearNote?.addEventListener("click", () => {
  noteArea.value = "";
  localStorage.removeItem("novaNote");
});

// --- CHATBOT PLACEHOLDER ---
const chatbotSection = document.getElementById("chatbot");
if (chatbotSection) {
  chatbotSection.innerHTML += `<p style="font-size:0.7rem; color:#a57dff;">Chatbot system loading soon...</p>`;
}
