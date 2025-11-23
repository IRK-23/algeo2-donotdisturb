// frontend/app.js
const btn = document.getElementById("btnSearch");
const input = document.getElementById("q");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");

async function search() {
  const q = input.value.trim();
  if (!q) {
    statusDiv.textContent = "Please enter a query.";
    return;
  }
  statusDiv.textContent = "Searching...";
  resultsDiv.innerHTML = "";

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, topn: 5 })
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>null);
      statusDiv.textContent = "Error: " + (err && err.error ? err.error : res.statusText);
      return;
    }

    const data = await res.json();
    statusDiv.textContent = `Query: "${data.query}" — ${data.results.length} results`;
    if (data.results.length === 0) {
      resultsDiv.innerHTML = "<p>No results</p>";
      return;
    }

    let html = "";
    for (const r of data.results) {
      html += `<div class="result"><span class="score">${r.score.toFixed(4)}</span> ${r.id} | ${r.title}</div>`;
    }
    resultsDiv.innerHTML = html;
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Network or server error. Is the backend running?";
  }
}

btn.addEventListener("click", search);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") search(); });
