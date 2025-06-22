const timerDiv = document.createElement('div');
timerDiv.id = 'timer-overlay';
timerDiv.style.position = 'fixed';
timerDiv.style.bottom = '20px';
timerDiv.style.right = '20px';
timerDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
timerDiv.style.color = 'white';
timerDiv.style.padding = '10px 15px';
timerDiv.style.fontFamily = 'Arial, sans-serif';
timerDiv.style.fontSize = '16px';
timerDiv.style.borderRadius = '8px';
timerDiv.style.zIndex = '999999';
timerDiv.style.userSelect = 'none';
timerDiv.style.boxShadow = '0 0 8px rgba(0,0,0,0.5)';
timerDiv.textContent = 'Timer: 00:00:00 | Purpose: None';

document.body.appendChild(timerDiv);

// ✅ move these to outer scope so all functions can access them
let secondsElapsed = 0;
let purpose = 'None';

chrome.storage.local.get(['seconds', 'purpose'], (result) => {
  secondsElapsed = result.seconds || 0;
  purpose = result.purpose || 'None';

  timerDiv.textContent = `Timer: ${formatTime(secondsElapsed)} | Purpose: ${purpose}`;

  const timerInterval = setInterval(() => {
    chrome.storage.local.set({ disablePrompt: true });
    secondsElapsed = Math.max(0, secondsElapsed - 1);

    // Update display and save
    timerDiv.textContent = `Timer: ${formatTime(secondsElapsed)} | Purpose: ${purpose}`;
    chrome.storage.local.set({ seconds: secondsElapsed });

    if (secondsElapsed === 0) {
      clearInterval(timerInterval); // stop timer
      onTimerFinished(); 
    }
  }, 1000);
});

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function onTimerFinished() {
  timerDiv.textContent = `Timer Done! | Purpose: ${purpose}`;
  alert(`⏰ Time's up for: ${purpose}`);
  chrome.storage.local.set({ disablePrompt: false });
}