// frontend/app.js
const btn = document.getElementById("btnSearch");
const input = document.getElementById("q");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");

function highlight(text, query) {
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
  const re = new RegExp(q, "gi");
  return text.replace(re, match => `<mark>${match}</mark>`);
}

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
      body: JSON.stringify({ query: q, topn: -1 })
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>null);
      statusDiv.textContent = "Error: " + (err && err.error ? err.error : res.statusText);
      return;
    }

    const data = await res.json();
    const count = data.results.length;

    statusDiv.textContent = `Query: "${data.query}" - ${count} results found`;

    if (count === 0) {
      resultsDiv.innerHTML = "<p>No results</p>";
      return;
    }

    let html = "";
    for (const r of data.results) {
      const highlighted = highlight(r.title, q);
      html += `
        <div class="result">
          <span class="id">ID: ${r.id}</span>
          <span class="title">${highlighted}</span>
        </div>`;
    }
    resultsDiv.innerHTML = html;
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "Network or server error.";
  }
}

btn.addEventListener("click", search);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search(); 
});
