chrome.storage.local.get('disablePrompt', ({ disablePrompt }) => {
    console.log(disablePrompt)
    if (disablePrompt) {
      console.log(disablePrompt)
        // Redirect to default new tab or something else
    window.location.href = "https://www.bing.com/"; // or blank.html
    chrome.storage.local.set({ disablePrompt: false });
} else {
    window.location.href = "prompt.html";
  }
});