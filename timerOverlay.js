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
timerDiv.textContent = 'Timer: 00:00:00 <br/> Purpose: None';

document.body.appendChild(timerDiv);

// Timer logic
let purpose = "none"
let secondsElapsed = 0;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

setInterval(() => {
  secondsElapsed++;
  timerDiv.textContent = `Timer: ${formatTime(secondsElapsed)} <br/> Purpose: ${purpose}`;
}, 1000);