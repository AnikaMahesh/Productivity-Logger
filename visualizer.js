chrome.storage.local.get("visitLogs", (data) => {
  const logs = data.visitLogs || [];
  const tbody = document.getElementById("logTable");

  logs.sort((a, b) => b.relevancy - a.relevancy);

  logs.forEach(log => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><a href="${log.url}" target="_blank">${log.url}</a></td><td>${log.relevancy}</td>`;
    tbody.appendChild(row);
  });
});
