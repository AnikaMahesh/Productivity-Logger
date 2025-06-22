let focusSessionActive = false;
let focusSessionEndTime = 0;
let timerInterval = null;
let relevancyCache = {};

// Broadcast timer + relevancy
function broadcast() {
  if (!focusSessionActive) return;
  const timeLeft = Math.max(focusSessionEndTime - Date.now(), 0);

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, {
        type: "timerUpdate",
        timeLeftMs: timeLeft,
        relevancy: relevancyCache[tab.id] ?? null
      }).catch(() => {});
    }
  });

  if (timeLeft <= 0) {
    focusSessionActive = false;
    clearInterval(timerInterval);
  }
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "startFocusSession") {
    focusSessionActive = true;
    focusSessionEndTime = Date.now() + msg.durationMinutes * 60000;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(broadcast, 1000);
    broadcast();
  }

  if (msg.type === "endFocusSession") {
    focusSessionActive = false;
    clearInterval(timerInterval);
    broadcast();
  }

  if (msg.type === "relevancyUpdate" && focusSessionActive) {
    relevancyCache[sender.tab.id] = msg.relevancy;
    if (msg.relevancy < 0.5) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Low Relevancy!",
        message: `Your relevancy is ${(msg.relevancy * 100).toFixed(2)}%. Refocus!`
      });
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "lowRelevancyAlert",
        percent: (msg.relevancy * 100).toFixed(2)
      });
    }
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (focusSessionActive) {
    chrome.tabs.sendMessage(tabId, { type: "recomputeRelevancy" }).catch(() => {});
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (focusSessionActive && changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { type: "recomputeRelevancy" }).catch(() => {});
  }
});
