let visitLogs = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "logVisit") {
    visitLogs.push({
      url: msg.url,
      relevancy: msg.relevancy
    });
    chrome.storage.local.set({ visitLogs: visitLogs });
  }
});
