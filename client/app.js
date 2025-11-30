const btnSearchTitle = document.getElementById("btnSearchTitle");
const btnSearchImage = document.getElementById("btnSearchImage");
const btnSearchText = document.getElementById("btnSearchText");

const inputTitle = document.getElementById("q");
const fileInputImage = document.getElementById("fileImage");
const fileInputText = document.getElementById("fileText");

const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");

function highlight(text, query) {
  const re = new RegExp(query, "gi");
  return text.replace(re, m => `<mark>${m}</mark>`);
}

function showResults(list, query=null) {
  resultsDiv.innerHTML = "";

  list.forEach(r => {
    const title = query ? highlight(r.title, query) : r.title;

    resultsDiv.innerHTML += `
      <div class="result">
        <img class="cover" src="/${r.cover}" />
        <div>
          <div>ID: ${r.id}</div>
          <div class="book-title">${title}</div>
        </div>
      </div>
    `;
  });
}

// -------------------------------------------------------------
// TITLE SEARCH
// -------------------------------------------------------------
btnSearchTitle.addEventListener("click", async () => {
  const q = inputTitle.value.trim();
  if (!q) return;

  statusDiv.textContent = "Searching title...";

  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  });

  const data = await res.json();

  statusDiv.textContent = `${data.count} results`;
  showResults(data.results, q);
});

// -------------------------------------------------------------
// IMAGE SEARCH
// -------------------------------------------------------------
btnSearchImage.addEventListener("click", async () => {
  const file = fileInputImage.files[0];
  if (!file) return alert("Choose an image first!");

  const form = new FormData();
  form.append("file", file);

  statusDiv.textContent = "Searching image...";

  const res = await fetch("/api/search/image", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  statusDiv.textContent = `${data.count} image results`;

  showResults(data.results);
});

// -------------------------------------------------------------
// TEXT SEARCH
// -------------------------------------------------------------
btnSearchText.addEventListener("click", async () => {
  const file = fileInputText.files[0];
  if (!file) return alert("Choose a .txt file first!");

  const form = new FormData();
  form.append("file", file);

  statusDiv.textContent = "Searching text...";

  const res = await fetch("/api/search/text", {
    method: "POST",
    body: form
  });

  const data = await res.json();

  statusDiv.textContent = `${data.count} text results`;
  showResults(data.results);
});
