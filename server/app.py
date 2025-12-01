# app.py (perubahan penting: serve_cover terlebih dahulu, /api/mapper, create QUERY_DIR)
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
from lib.LSA.main_lsa import preprocess_txt
from main_test_cover import preprocess_cover

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

# ensure query dir exists
os.makedirs(QUERY_DIR, exist_ok=True)

# =====================================================================
# LOAD BOOK DATA
# =====================================================================

with open(MAPPER_PATH, "r", encoding="utf-8") as f:
    mapper = json.load(f)

ids = list(mapper.keys())

# Load LSA embeddings
D_norm, doc_paths = load_doc_embeddings()

app = Flask(__name__, static_folder=str(CLIENT_DIR), static_url_path="")
CORS(app)

# =====================================================================
# STATIC FILE ROUTES
# =====================================================================

@app.route("/")
def index():
    return send_from_directory(str(CLIENT_DIR), "index.html")

# serve covers BEFORE generic client_files so /covers/* is handled properly
@app.route("/covers/<path:filename>")
def serve_cover(filename):
    filename = os.path.basename(filename)
    real_path = COVER_DIR / filename
    if not real_path.exists():
        abort(404)
    return send_from_directory(str(COVER_DIR), filename)

# serve client static files (JS/CSS/etc). This will not catch /covers/* anymore
@app.route("/<path:filename>")
def client_files(filename):
    file_path = CLIENT_DIR / filename
    if file_path.exists():
        return send_from_directory(str(CLIENT_DIR), filename)
    abort(404)

# =====================================================================
# NEW: expose mapper to client so it can build full mapperCache
# =====================================================================
@app.route("/api/mapper")
def api_mapper():
    return jsonify(mapper)

# (the rest of your API routes remain the same)
# =====================================================================
# SEARCH BY TITLE (SUBSTRING)
# =====================================================================
@app.route("/api/search", methods=["POST"])
def search_title():
    data = request.get_json(force=True)
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Empty query"}), 400
    q = query.lower()
    results = []
    for bid in ids:
        title = mapper[bid]["title"]
        if q in title.lower():
            results.append({
                "id": bid,
                "title": title,
                "cover": f"/covers/{Path(mapper[bid]['cover']).name}",
            })
    return jsonify({"query": query, "count": len(results), "results": results})

# =====================================================================
# IMAGE SEARCH (PCA)
# =====================================================================
@app.route("/api/search/image", methods=["POST"])
def search_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png"]:
        return jsonify({"error": "Only JPG/PNG allowed"}), 400
    tmp_name = f"{uuid.uuid4()}.{ext}"
    tmp_path = QUERY_DIR / tmp_name
    file.save(tmp_path)  # QUERY_DIR exists now

    results = process_query(str(tmp_path), str(MODEL_DIR), top_k=10)
    image_files = sorted(os.listdir(COVER_DIR))
    book_ids = [fname.split('.')[0] for fname in image_files]

    final_results = []
    for idx, dist in results:
        bid = book_ids[idx]
        final_results.append({
            "id": bid,
            "title": mapper[bid]["title"],
            "cover": f"/covers/{Path(mapper[bid]['cover']).name}",
            "distance": float(dist),
        })
    return jsonify({"count": len(final_results), "results": final_results})

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

    dq_norm = compute_query_embedding(text)
    results = search_similar_documents(
        dq_norm, D_norm, doc_paths,
        top_k=10, remove_self=False, self_index=None
    )
    final = []
    for idx, score, path in results:
        bid = Path(path).stem
        final.append({
            "id": bid,
            "title": mapper[bid]["title"],
            "cover": f"/covers/{Path(mapper[bid]['cover']).name}",
            "similarity": float(score),
        })
    return jsonify({"count": len(final), "results": final})

# =====================================================================
# PAGINATED BOOK LIST (10 per page)
# =====================================================================
@app.route("/api/books")
def list_books():
    page = int(request.args.get("page", 1))
    per_page = 10
    all_ids = sorted(ids)
    start = (page - 1) * per_page
    end = start + per_page
    sliced = all_ids[start:end]
    results = [{
        "id": bid,
        "title": mapper[bid]["title"],
        "cover": f"/covers/{Path(mapper[bid]['cover']).name}",
    } for bid in sliced]
    total_pages = (len(all_ids) + per_page - 1) // per_page
    return jsonify({"page": page, "total_pages": total_pages, "results": results})

# =====================================================================
# BOOK DETAIL
# =====================================================================
@app.route("/api/book/<book_id>")
def book_detail(book_id):
    if book_id not in mapper:
        return jsonify({"error": "Book not found"}), 404
    txt_path = TXT_DIR / Path(mapper[book_id]["txt"]).name
    try:
        content = txt_path.read_text(encoding="utf-8", errors="ignore")
    except:
        content = "(Cannot load text)"
    return jsonify({
        "id": book_id,
        "title": mapper[book_id]["title"],
        "cover": f"/covers/{Path(mapper[book_id]['cover']).name}",
        "text": content
    })

# =====================================================================
# BOOK RECOMMENDATION (LSA)
# =====================================================================
@app.route("/api/recommend/<book_id>")
def recommend(book_id):
    if book_id not in mapper:
        return jsonify({"error": "Book not found"}), 404
    try:
        idx = [Path(p).stem for p in doc_paths].index(book_id)
    except ValueError:
        return jsonify({"error": "Embedding not found"}), 500
    dq = D_norm[idx]
    recs = search_similar_documents(
        dq, D_norm, doc_paths,
        top_k=5, remove_self=True, self_index=idx
    )
    final = []
    for idx, score, path in recs:
        bid = Path(path).stem
        final.append({
            "id": bid,
            "title": mapper[bid]["title"],
            "cover": f"/covers/{Path(mapper[bid]['cover']).name}",
            "similarity": float(score)
        })
    return jsonify({"count": len(final), "results": final})

# =====================================================================
if __name__ == "__main__":
    preprocess_txt()
    preprocess_cover()
    app.run(port=5000, debug=True)
