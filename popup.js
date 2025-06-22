document.getElementById("start").addEventListener("click", () => {
  const purpose = document.getElementById("purpose").value.trim();
  const time = parseInt(document.getElementById("time").value);

  if (!purpose || isNaN(time) || time <= 0) {
    alert("Please enter a valid purpose and time.");
    return;
  }

  chrome.storage.local.set({
    purpose: purpose,
    timeLimit: time * 60, // convert to seconds
    startTime: Date.now() / 1000
  }, () => {
    document.getElementById("status").textContent = "Focus session started!";
  });
});
