const STORAGE_KEY = "ytMode";
const MARKER_ATTR = "data-yt-focus";
const STYLE_ID = "yt-focus-mode-style";

const FOCUS_CSS = `
html[${MARKER_ATTR}="1"] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
html[${MARKER_ATTR}="1"] ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer,
html[${MARKER_ATTR}="1"] ytd-watch-flexy #related,
html[${MARKER_ATTR}="1"] ytd-guide-entry-renderer:has(a[href^="/shorts"]),
html[${MARKER_ATTR}="1"] ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]) {
  display: none !important;
}
`;

let currentMode = "normal";

function ensureStyle() {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = FOCUS_CSS;
    document.documentElement.appendChild(style);
  }
}

function setMarker(enabled) {
  if (enabled) {
    document.documentElement.setAttribute(MARKER_ATTR, "1");
  } else {
    document.documentElement.removeAttribute(MARKER_ATTR);
  }
}

function applyMode(mode) {
  currentMode = mode === "focus" ? "focus" : "normal";
  ensureStyle();
  setMarker(currentMode === "focus");
}

async function loadMode() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  applyMode(data[STORAGE_KEY]);
}

function handleStorageChange(changes, areaName) {
  if (areaName !== "local" || !changes[STORAGE_KEY]) {
    return;
  }
  applyMode(changes[STORAGE_KEY].newValue);
}

function handleNavigationEvent() {
  setMarker(currentMode === "focus");
}

chrome.storage.onChanged.addListener(handleStorageChange);
document.addEventListener("yt-navigate-finish", handleNavigationEvent);
document.addEventListener("yt-page-data-updated", handleNavigationEvent);
window.addEventListener("popstate", handleNavigationEvent);

void loadMode();
