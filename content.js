// Create floating panel
const panel = document.createElement("div");
panel.style.position = "fixed";
panel.style.bottom = "10px";
panel.style.right = "10px";
panel.style.padding = "10px";
panel.style.background = "#e0f7e9";
panel.style.color = "#333";
panel.style.border = "1px solid #4CAF50";
panel.style.borderRadius = "8px";
panel.style.zIndex = "9999";
document.body.appendChild(panel);

// Utility: compute simple relevancy (keyword matching)
function computeRelevancy(text, purpose) {
  const keywords = purpose.toLowerCase().split(/\s+/);
  const content = text.toLowerCase();
  let hits = 0;
  keywords.forEach(k => {
    if (content.includes(k)) hits++;
  });
  return Math.round((hits / keywords.length) * 100);
}

// Update panel info
function updatePanel(purpose, timeLeft, relevancy) {
  panel.innerHTML = `
    <b>Focus: </b> ${purpose} <br>
    <b>Time Left: </b> ${timeLeft} sec<br>
    <b>Relevancy: </b> ${relevancy}%
  `;
}

// Main check
chrome.storage.local.get(["purpose", "timeLimit", "startTime"], (data) => {
  if (!data.purpose) return;

  // Scrape page text
  const bodyText = document.body.innerText || "";
  const relevancy = computeRelevancy(bodyText, data.purpose);

  const now = Date.now() / 1000;
  const timeLeft = Math.max(0, Math.round(data.timeLimit - (now - data.startTime)));

  updatePanel(data.purpose, timeLeft, relevancy);

  // Warn if relevancy < 50%
  if (relevancy < 50) {
    alert("⚠️ This page is not relevant to your focus session!");
  }

  // Save log
  chrome.runtime.sendMessage({
    type: "logVisit",
    url: window.location.href,
    relevancy: relevancy
  });

  // Keep updating time every second
  setInterval(() => {
    const now2 = Date.now() / 1000;
    const timeLeft2 = Math.max(0, Math.round(data.timeLimit - (now2 - data.startTime)));
    updatePanel(data.purpose, timeLeft2, relevancy);
  }, 1000);
});
