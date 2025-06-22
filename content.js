let userPurpose = "focus";
let relevancy = null;
let timerMsLeft = 0;
let floatingWidget = null;
let focusSessionActive = false;

// 🗂 Load user purpose
chrome.storage.local.get(['userPurpose'], (res) => {
  userPurpose = res.userPurpose || "focus";
});

// Simple word overlap similarity
function simpleSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const aWords = new Set(a.match(/\b\w+\b/g));
  const bWords = new Set(b.match(/\b\w+\b/g));
  if (!aWords.size || !bWords.size) return 0;
  let common = 0;
  aWords.forEach(w => { if (bWords.has(w)) common++; });
  return common / Math.max(aWords.size, bWords.size);
}

// Create floating widget
function createFloatingWidget() {
  if (floatingWidget) return;
  floatingWidget = document.createElement("div");
  Object.assign(floatingWidget.style, {
    position: "fixed",
    bottom: "15px",
    right: "15px",
    padding: "12px 18px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    borderRadius: "8px",
    zIndex: 999999,
    minWidth: "200px",
    whiteSpace: "pre-line",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    userSelect: "none",
    cursor: "default"
  });
  floatingWidget.textContent = "Loading...";
  document.body.appendChild(floatingWidget);
}

// Update widget content
function updateFloatingWidget() {
  const mins = Math.floor(timerMsLeft / 60000);
  const secs = Math.floor((timerMsLeft % 60000) / 1000);
  const timeStr = focusSessionActive ? `${mins}m ${secs}s left` : "No active session";
  const relevancyStr = relevancy !== null ? `${(relevancy * 100).toFixed(2)}%` : "N/A";
  floatingWidget.textContent = `⏳ Focus Timer: ${timeStr}\n🎯 Relevancy: ${relevancyStr}`;
}

// Recompute relevancy
function recomputeRelevancy() {
  const pageText = document.title || location.hostname;
  relevancy = simpleSimilarity(pageText, userPurpose);
  chrome.runtime.sendMessage({ type: "relevancyUpdate", relevancy });
  updateFloatingWidget();
}

// Initialize widget + first relevance check + interval
createFloatingWidget();
recomputeRelevancy();
setInterval(() => {
  if (focusSessionActive) recomputeRelevancy();
}, 10000);

// Listen for updates from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "timerUpdate") {
    timerMsLeft = msg.timeLeftMs;
    focusSessionActive = timerMsLeft > 0;
    updateFloatingWidget();
  } else if (msg.type === "lowRelevancyAlert") {
    alert(`⚠️ Relevancy dropped below 50%! (${msg.percent}%)`);
  } else if (msg.type === "recomputeRelevancy") {
    recomputeRelevancy();
  }
});
