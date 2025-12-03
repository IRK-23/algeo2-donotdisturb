let mapperCache = {};

const btnSearch = document.getElementById("btnSearch");
const input = document.getElementById("q");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");

const btnImage = document.getElementById("btnImage");
const imgInput = document.getElementById("imgInput");

const btnText = document.getElementById("btnText");
const txtInput = document.getElementById("txtInput");

const btnHome = document.getElementById("btnHome");

/* =============================
   1. SEARCH TITLE
================================ */
async function searchTitle() {
    const q = input.value.trim();
    if (!q) {
        statusDiv.textContent = "Please enter a query.";
        return;
    }

    resultsDiv.innerHTML = "";
    statusDiv.textContent = "Searching title...";

    const res = await fetch("/api/search", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: q})
    });

    const data = await res.json();
    renderResults(data.results);

    document.getElementById("pagination").innerHTML = "";
    statusDiv.textContent = `${data.count} results.`;
}

btnSearch.onclick = searchTitle;
input.addEventListener("keydown", e => { if (e.key==="Enter") searchTitle(); });

/* =============================
   2. SEARCH BY IMAGE
================================ */
btnImage.onclick = () => imgInput.click();

imgInput.onchange = async () => {
    if (!imgInput.files.length) return;

    const form = new FormData();
    form.append("file", imgInput.files[0]);

    resultsDiv.innerHTML = "";
    statusDiv.textContent = "Searching by image...";

    const res = await fetch("/api/search/image", {
        method: "POST",
        body: form
    });

    const data = await res.json();
    renderResults(data.results);

    document.getElementById("pagination").innerHTML = "";
    statusDiv.textContent = `${data.count} image results`;
};

/* =============================
   3. SEARCH BY TEXT
================================ */
btnText.onclick = () => txtInput.click();

txtInput.onchange = async () => {
    if (!txtInput.files.length) return;

    const form = new FormData();
    form.append("file", txtInput.files[0]);

    resultsDiv.innerHTML = "";
    statusDiv.textContent = "Searching by text...";

    const res = await fetch("/api/search/text", {
        method: "POST",
        body: form
    });

    const data = await res.json();
    renderResults(data.results);

    document.getElementById("pagination").innerHTML = "";
    statusDiv.textContent = `${data.count} text results`;
};

/* =============================
   4. HOME PAGE (PAGE 1)
================================ */
btnHome.onclick = () => loadPage(1);

async function loadHome() {
    loadPage(1);
}

/* =============================
   5. PAGINATION
================================ */
async function loadPage(page) {
    statusDiv.textContent = "Loading books...";

    const res = await fetch(`/api/books?page=${page}`);
    const data = await res.json();

    renderResults(data.results);
    renderPagination(page, data.total_pages);

    statusDiv.textContent = `Page ${page} of ${data.total_pages}`;
}

function renderPagination(current, total) {
    const pag = document.getElementById("pagination");
    pag.innerHTML = "";

    const prev = document.createElement("button");
    prev.textContent = "Prev";
    prev.disabled = current === 1;
    prev.onclick = () => loadPage(current - 1);
    pag.appendChild(prev);

    const next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = current === total;
    next.onclick = () => loadPage(current + 1);
    pag.appendChild(next);
}

/* =============================
   6. DISPLAY RESULTS
================================ */
function renderResults(items) {
    resultsDiv.innerHTML = "";

    for (const r of items) {
        const div = document.createElement("div");
        div.className = "item";
        div.style.cursor = "pointer";

        div.innerHTML = `
            <img src="${r.cover}" width="100"><br>
            <b>${r.title}</b><br>
            ID: ${r.id}
        `;

        div.onclick = () => openBookDetail(r.id);
        resultsDiv.appendChild(div);
    }
}

/* =============================
   7. POPUP DETAILS (recs clickable)
================================ */
async function openBookDetail(id) {
    const detail = await fetch(`/api/book/${id}`).then(r => r.json());
    const recs = await fetch(`/api/recommend/${id}`).then(r => r.json());

    let html = `
        <button onclick="closePopup()" style="float:right;font-size:18px;">X</button>
        <h3>${detail.title}</h3>
        <img src="${detail.cover}" width="200"><br>

        <pre style="max-height:300px;overflow:auto;background:#eee;padding:10px;">
${detail.text}
        </pre>

        <h4>Recommended Books</h4>
        <div id="recList" style="display:flex;gap:10px;flex-wrap:wrap;">
    `;

    // RECOMMENDATION LIST
    for (const r of recs.results) {
        html += `
            <div class="rec-item" 
                 data-id="${r.id}"
                 style="cursor:pointer;text-align:center;">
                <img src="${r.cover}" width="80"><br>
                ${r.title}
            </div>
        `;
    }

    html += `</div>`;

    document.getElementById("popupContent").innerHTML = html;
    document.getElementById("popup").style.display = "block";

    // Attach click handlers
    setTimeout(() => {
        document.querySelectorAll(".rec-item").forEach(div => {
            const bid = div.dataset.id;
            div.onclick = () => openBookDetail(bid);
        });
    }, 20);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

/* =============================
   8. AUTO LOAD HOME
================================ */
window.onload = loadHome;
