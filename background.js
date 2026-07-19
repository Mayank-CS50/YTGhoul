chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.ytMode) {
    const newValue = changes.ytMode.newValue;
    if (newValue === "normal") {
      // Set an alarm for 5 minutes when switched to normal mode
      chrome.alarms.create("focusAlarm", { delayInMinutes: 5 });
    } else if (newValue === "focus") {
      // Cancel the alarm if user manually switches back to focus mode
      chrome.alarms.clear("focusAlarm");
    }
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusAlarm") {
    // Switch back to focus mode after 5 minutes.
    // Other tabs live-apply this via storage.onChanged — only the active
    // YouTube tab gets refreshed, for a clean reset.
    chrome.storage.local.set({ ytMode: "focus" }, () => {
      chrome.tabs.query(
        { active: true, lastFocusedWindow: true, url: "https://www.youtube.com/*" },
        (tabs) => {
          if (tabs[0]) chrome.tabs.reload(tabs[0].id);
        }
      );
    });
  }
});
