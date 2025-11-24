from pathlib import Path
import sys
import json
from flask import Flask, request, jsonify, send_from_directory, abort

#  Setup base paths
BASE = Path(__file__).resolve().parent           # src/backend
LIB_DIR = BASE / "lib"

from lib.lsa_module import (
# if str(LIB_DIR) not in sys.path:
#     sys.path.insert(0, str(LIB_DIR))

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
n_books = len(titles)
print(f"Loaded {n_books} titles")

# Fungsi substring matching search
def substring_search(titles, query):
    q = query.lower()
    result_idx = []
    for i, title in enumerate(titles):
        if q in title.lower():
            result_idx.append(i)

    return result_idx

# -------------------------------------------------------------
#  Flask App
# -------------------------------------------------------------

FRONTEND_DIR = BASE.parent / "frontend"   # folder: src/frontend

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")

# Serve index.html
@app.route("/", methods=["GET"])
def index():
    return send_from_directory(str(FRONTEND_DIR), "index.html")

# Serve static files (JS/CSS)
@app.route("/<path:filename>")
def frontend_files(filename):
    file_path = FRONTEND_DIR / filename
    if file_path.exists():
        return send_from_directory(str(FRONTEND_DIR), filename)
    abort(404)

#  API substring search
@app.route("/api/search", methods=["POST"])
def api_search():
    data = request.get_json(force=True)

    query = (data.get("query") or "").strip()
    if query == "":
        return jsonify({"error": "query is empty"}), 400

    matched_idx = substring_search(titles, query)

    # Build results
    results = [
        {
            "id": ids[i],
            "title": titles[i]
        }
        for i in matched_idx
    ]

    return jsonify({
        "query": query,
        "results": results
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False) #debug = True mengakibatkan main.py dijalankan dua kali (searching nanti salah)
