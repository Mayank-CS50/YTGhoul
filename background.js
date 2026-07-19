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
    // Content scripts live-apply this via storage.onChanged — no tab reload needed.
    chrome.storage.local.set({ ytMode: "focus" });
  }
});
