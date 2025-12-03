import json
import sys
from pathlib import Path

# === INISIALISASI ===
# Path file ini: ../server/title_search.py
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent  # Naik 1 level ke ALGEO2-DONOTDISTURB

DATASET_JSON = PROJECT_ROOT / "data" / "mapper.json"

# Load JSON dengan error handling
try:
    with open(DATASET_JSON, "r", encoding="utf-8") as f:
        mapper = json.load(f)
except FileNotFoundError:
    print(f"Error: File {DATASET_JSON} tidak ditemukan. Periksa path.")
    sys.exit(1)
except json.JSONDecodeError:
    print("Error: File JSON tidak valid.")
    sys.exit(1)

ids = list(mapper.keys())                   # Semua ID buku
titles = [mapper[i]["title"] for i in ids]  # Semua judul buku
n_books = len(titles)
print(f"Loaded {n_books} titles from {DATASET_JSON}")

# Fungsi substring matching search
def search_titles_with_index(titles, query):
    query = query.lower()
    results = []

    for i, title in enumerate(titles):
        if query in title.lower():
            results.append(i)

    return results

# === TES PROGRAM ===
# Search loop
# while True:
#     q = input("\nMasukkan judul (exit untuk keluar): ").strip()
#     if q.lower() == "exit":
#         break
#     if not q:
#         print("Query kosong, coba lagi.")
#         continue

#     print("\nHasil pencarian:")
#     matched_idx = search_titles_with_index(titles, q)
#     if len(matched_idx) == 0:
#         print("Tidak ada hasil yang relevan.")
#     else:
#         for idx in matched_idx:
#             print(f"{ids[idx]} | {titles[idx]}")