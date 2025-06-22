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

chrome.storage.local.get(['seconds', 'purpose'], (result) => {
    let secondsElapsed = result.seconds || 0;
    let purpose = result.purpose || 'None';
    timerDiv.textContent = `Timer: ${formatTime(secondsElapsed)} | Purpose: ${purpose}`;
    setInterval(() => {
        chrome.storage.local.set({disablePrompt: true});
        secondsElapsed = Math.max(0, secondsElapsed - 1);
        
        // Update the display
        timerDiv.textContent = `Timer: ${formatTime(secondsElapsed)} | Purpose: ${purpose}`;
        
        // Persist the current value
        chrome.storage.local.set({ seconds: secondsElapsed });
      
        // Optional: trigger something when timer hits 0
        if (secondsElapsed === 0) {
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
    alert(`Time's up for: ${purpose}`);
    chrome.storage.local.set({disablePrompt: false});
  }