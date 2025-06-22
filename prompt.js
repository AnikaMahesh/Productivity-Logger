chrome.storage.local.clear(() => {
    console.log("All extension storage cleared.");
  });
document.getElementById('saveBtn').addEventListener('click', () => {
    const input = document.getElementById('userInput').value.trim();
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
    });
  });