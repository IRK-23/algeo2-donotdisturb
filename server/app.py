from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
from pathlib import Path
import json
import os
import uuid

# === Import PCA & LSA ===
from lib.PCA.query_pca import process_query
from lib.LSA.code.lsa_search import (
    load_doc_embeddings,
    compute_query_embedding,
    search_similar_documents
)

# =====================================================================
# PATH SETUP
# =====================================================================

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SERVER_DIR.parent
CLIENT_DIR = PROJECT_DIR / "client"

DATA_DIR = SERVER_DIR / "data"
COVER_DIR = DATA_DIR / "covers"
TXT_DIR = DATA_DIR / "txt"
QUERY_DIR = DATA_DIR / "query"
MODEL_DIR = SERVER_DIR / "model" / "pca_model_test"

MAPPER_PATH = DATA_DIR / "mapper.json"

# =====================================================================
# LOAD BOOK DATA
# =====================================================================

with open(MAPPER_PATH, "r", encoding="utf-8") as f:
    mapper = json.load(f)

ids = list(mapper.keys())
titles = [mapper[i]["title"] for i in ids]

# Load LSA embeddings
D_norm, doc_paths = load_doc_embeddings()

app = Flask(__name__, static_folder=str(CLIENT_DIR), static_url_path="")
CORS(app)

# =====================================================================
# STATIC ROUTES
# =====================================================================

@app.route("/")
def index():
    return send_from_directory(str(CLIENT_DIR), "index.html")

@app.route("/<path:filename>")
def client_files(filename):
    path = CLIENT_DIR / filename
    if path.exists():
        return send_from_directory(str(CLIENT_DIR), filename)
    abort(404)

@app.route("/covers/<filename>")
def serve_cover(filename):
    return send_from_directory(str(COVER_DIR), filename)

# =====================================================================
# TITLE SEARCH
# =====================================================================

def substring_search(titles, query):
    q = query.lower()
    return [i for i, t in enumerate(titles) if q in t.lower()]

@app.route("/api/search", methods=["POST"])
def search_title():
    data = request.get_json(force=True)
    q = data.get("query", "").strip()

    if q == "":
        return jsonify({"error": "Query is empty"}), 400

    idxs = substring_search(titles, q)

    results = []
    for i in idxs:
        bid = ids[i]
        results.append({
            "id": bid,
            "title": titles[i],
            "cover": mapper[bid]["cover"],
            "txt": mapper[bid]["txt"]
        })

    return jsonify({"query": q, "count": len(results), "results": results})

# =====================================================================
# IMAGE SEARCH (PCA)
# =====================================================================

@app.route("/api/search/image", methods=["POST"])
def search_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty file name"}), 400

    # Save uploaded image temporarily
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png"]:
        return jsonify({"error": "Only JPG/PNG allowed"}), 400

    tmp_name = f"{uuid.uuid4()}.{ext}"
    tmp_path = QUERY_DIR / tmp_name
    file.save(tmp_path)

    # Run PCA search
    results = process_query(str(tmp_path), str(MODEL_DIR), top_k=10)

    # Map PCA result idx → book_id
    image_files = sorted(os.listdir(COVER_DIR))
    book_ids = [fname.split('.')[0] for fname in image_files]

    final_results = []
    for idx, dist in results:
        bid = book_ids[idx]
        final_results.append({
            "id": bid,
            "title": mapper[bid]["title"],
            "cover": mapper[bid]["cover"],
            "txt": mapper[bid]["txt"],
            "distance": float(dist)
        })

    return jsonify({
        "count": len(final_results),
        "results": final_results
    })


# =====================================================================
# TEXT SEARCH (LSA)
# =====================================================================

@app.route("/api/search/text", methods=["POST"])
def search_text():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".txt"):
        return jsonify({"error": "Only .txt allowed"}), 400

    text = file.read().decode("utf-8", errors="ignore")

    if not text.strip():
        return jsonify({"error": "Empty text file"}), 400

    # Convert text → embedding
    dq_norm = compute_query_embedding(text)

    # Cosine similarity search
    results = search_similar_documents(
        dq_norm=dq_norm,
        D_norm=D_norm,
        doc_paths=doc_paths,
        top_k=10,
        remove_self=False,
        self_index=None
    )

    final_results = []
    for idx, score, path in results:
        book_id = Path(path).stem
        final_results.append({
            "id": book_id,
            "title": mapper[book_id]["title"],
            "cover": mapper[book_id]["cover"],
            "txt": mapper[book_id]["txt"],
            "similarity": float(score)
        })

    return jsonify({
        "count": len(final_results),
        "results": final_results
    })

# =====================================================================

if __name__ == "__main__":
    app.run(port=5000, debug=True)
