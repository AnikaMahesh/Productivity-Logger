document.getElementById('savePurposeBtn').addEventListener('click', () => {
  const purpose = document.getElementById('purposeInput').value.trim();
  if (purpose) {
    chrome.storage.local.set({ userPurpose: purpose }, () => {
      alert(`Saved purpose: "${purpose}"`);
    });
  } else {
    alert("Enter a valid purpose!");
  }
});

document.getElementById('startSessionBtn').addEventListener('click', () => {
  const duration = parseInt(document.getElementById('durationInput').value);
  if (!duration || duration <= 0) {
    alert("Enter a valid duration!");
    return;
  }
  chrome.runtime.sendMessage({ type: "startFocusSession", durationMinutes: duration });
  alert("Focus session started!");
});

document.getElementById('endSessionBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "endFocusSession" });
  alert("Focus session ended!");
});
