
document.getElementById('saveBtn').addEventListener('click', () => {
    const input = document.getElementById('userInput').value.trim();
    const timerVal = document.getElementById('inputTime').value.trim();
    if (!input) return;                                  // do nothing if empty
  
    chrome.storage.local.get({ logs: [] }, ({ logs }) => {
      logs.push({ input, time: new Date().toISOString() });
  
      chrome.storage.local.set(
        { logs, purpose: input},
        () => {
          document.getElementById('status').textContent = 'saved'
          document.getElementById('userInput').value = '';
        }
      );
      chrome.storage.local.set({ disablePrompt: true });
      chrome.storage.local.set({ seconds: timerVal, purpose: input}, () => {
        console.log('Data saved to storage!');
      });
    });
  });