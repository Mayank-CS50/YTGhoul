const STORAGE_KEY = "ytMode";
const modes = {
  normal: document.getElementById("mode-normal"),
  focus: document.getElementById("mode-focus")
};
const status = document.getElementById("status");
const timerEl = document.getElementById("timer");
let countdownInterval = null;

function setStatus(mode) {
  status.textContent = mode === "focus"
    ? "Focus mode is on. Home recommendations are hidden."
    : "Normal mode is on.";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

async function updateTimer() {
  const alarm = await chrome.alarms.get("focusAlarm");
  if (alarm && alarm.scheduledTime > Date.now()) {
    timerEl.style.display = "block";
    timerEl.textContent = `Auto-focus in: ${formatTime(alarm.scheduledTime - Date.now())}`;
  } else {
    timerEl.style.display = "none";
  }
}

function applyMode(mode) {
  const resolvedMode = mode === "focus" ? "focus" : "normal";
  modes[resolvedMode].checked = true;
  setStatus(resolvedMode);

  if (resolvedMode === "normal") {
    if (!countdownInterval) {
      setTimeout(updateTimer, 100); // small delay to let background script create alarm
      countdownInterval = setInterval(updateTimer, 1000);
    }
  } else {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    timerEl.style.display = "none";
  }
}

async function loadMode() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  applyMode(data[STORAGE_KEY]);
}

async function saveMode(mode) {
  await chrome.storage.local.set({ [STORAGE_KEY]: mode });
  applyMode(mode);
}

modes.normal.addEventListener("change", () => {
  if (modes.normal.checked) {
    void saveMode("normal");
  }
});

modes.focus.addEventListener("change", () => {
  if (modes.focus.checked) {
    void saveMode("focus");
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[STORAGE_KEY]) {
    applyMode(changes[STORAGE_KEY].newValue);
  }
});

void loadMode();
