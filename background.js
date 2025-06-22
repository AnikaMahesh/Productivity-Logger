
function logUrlVisit(url) {
  chrome.storage.local.get({ visitedUrls: [] }, (data) => {
    const updatedUrls = data.visitedUrls;
    updatedUrls.push({
      url: url,
      timestamp: new Date().toISOString(),
    });
    chrome.storage.local.set({ visitedUrls: updatedUrls });
  });
}

// Listen to tab updates (traditional page loads)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log("Visited URL (tabs):", changeInfo.url);
    logUrlVisit(changeInfo.url);
  }
});

// Safely listen to webNavigation if available (SPA route changes)
if (chrome.webNavigation && chrome.webNavigation.onCompleted) {
  chrome.webNavigation.onCompleted.addListener(
    (details) => {
      console.log("Navigation completed to:", details.url);
      logUrlVisit(details.url);
    },
    { url: [{ schemes: ["http", "https"] }] }
  );
} else {
  console.error("chrome.webNavigation API not available!");
}