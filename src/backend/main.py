from pathlib import Path
import sys
import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory, abort

#  Setup base paths
BASE = Path(__file__).resolve().parent           # src/backend
LIB_DIR = BASE / "lib"
CACHE_FILE = BASE / "title_cache.npz"

#   Setup Latency
K = 50 # Makin besar, makin akurat, tetapi jangan sampai overfitting dan bisa kelamaaan


if str(LIB_DIR) not in sys.path:
    sys.path.insert(0, str(LIB_DIR))

#  Import custom modules 
from lib.token_module import tokenize, build_vocab, build_term_doc_counts
from lib.tf_idf_module import compute_tf, compute_idf, compute_tfidf
from lib.svd_module import svd_truncated
from lib.lsa_module import (
    build_query_vector,
    project_query_to_lsa,
    doc_embeddings,
    normalize_rows,
    cosine_similarities_for,
)
from cache import save_lsa_cache, load_lsa_cache

#  Locate mapper.json
def find_mapper_json():
    cand = BASE.parent.parent / "data" / "mapper.json"
    if cand.exists():
        return cand

    cand = BASE.parent / ".." / "data" / "mapper.json"
    if cand.exists():
        return cand.resolve()

    cand = Path.cwd() / "data" / "mapper.json"
    if cand.exists():
        return cand.resolve()

    return None


MAPPER = find_mapper_json()
if MAPPER is None:
    raise FileNotFoundError("mapper.json tidak ditemukan!")

#  Load book data
with open(MAPPER, "r", encoding="utf-8") as f:
    mapper = json.load(f)

ids = list(mapper.keys())
titles = [mapper[i]["title"] for i in ids]

# Load cache file
if CACHE_FILE.exists():
    print("Loading cached model...")
    (vocab, A_counts, TF, IDF, A, U_k, Sigma_k, Vt_k, D_norm) = load_lsa_cache(CACHE_FILE)
else:
    print("Building model from scratch...")
    #  Build TF-IDF matrix (terms × docs)
    book_tokens = [tokenize(t) for t in titles]
    vocab = build_vocab(book_tokens)
    A_counts = build_term_doc_counts(book_tokens, vocab)

    TF  = compute_tf(A_counts)
    IDF = compute_idf(A_counts)
    A   = compute_tfidf(TF, IDF)

    #  Truncated SVD using your custom power-iteration SVD
    U_k, Sigma_k, Vt_k = svd_truncated(A, K)

    #  Build normalized document embeddings (docs × k)
    D = doc_embeddings(Vt_k, Sigma_k)
    D_norm = normalize_rows(D)

    #   Save cache
    save_lsa_cache(CACHE_FILE, vocab, A_counts, TF, IDF,
                   A, U_k, Sigma_k, Vt_k, D_norm)

print("LSA model ready.")
print(f"Matrix shape A: {A.shape}")
print(f"SVD latent dimension k = {min(K, A.shape[1])}")

# -------------------------------------------------------------
#  Flask App
# -------------------------------------------------------------

FRONTEND_DIR = BASE.parent / "frontend"   # folder: src/frontend

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")

#   Serve index.html
@app.route("/", methods=["GET"])
def index():
    return send_from_directory(str(FRONTEND_DIR), "index.html")

#   Serve static files (JS/CSS)
@app.route("/<path:filename>")
def frontend_files(filename):
    file_path = FRONTEND_DIR / filename
    if file_path.exists():
        return send_from_directory(str(FRONTEND_DIR), filename)
    abort(404)


#  API endpoint for LSA Search
@app.route("/api/search", methods=["POST"])
def api_search():
    data = request.get_json(force=True)

    query = (data.get("query") or "").strip()
    if query == "":
        return jsonify({"error": "query is empty"}), 400

    # Convert query to LSA
    q_vec = build_query_vector(query, vocab, IDF)
    q_lsa = project_query_to_lsa(q_vec, U_k, Sigma_k)

    # Create similarity
    sims = cosine_similarities_for(q_lsa, D_norm)

    # Rank docs
    order = np.argsort(-sims)
    topn  = int(data.get("topn", 5))
    top_idx = order[:topn]

    # Build results
    results = [
        {
            "id": ids[i],
            "title": titles[i],
            "score": float(sims[i]),
        }
        for i in top_idx
    ]

    return jsonify({
        "query": query,
        "results": results
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False) #debug = True mengakibatkan main.py dijalankan dua kali (searching nanti salah)
