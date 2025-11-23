import json
import sys
from pathlib import Path
from lib.eigen_module import *
from lib.lsa_module import *
from lib.svd_module import *
from lib.tf_idf_module import *
from lib.token_module import *

# === INISIALISASI ===
# Path file ini: ../src/backend/Title.py
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent  # Naik 2 level ke ALGEO2-DONOTDISTURB

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

# Token tiap title
book_tokens = [tokenize(t) for t in titles]  # List of list of tokens

# Cek jika ada token valid
if not book_tokens or all(len(tokens) == 0 for tokens in book_tokens):
    print("Error: Tidak ada token valid dari judul. Periksa data atau fungsi tokenize.")
    sys.exit(1)

# Buat vocab dari semua token
vocab = build_vocab(book_tokens)
n_terms = len(vocab)  # Jumlah kata unik
print(f"Vocab size: {n_terms} terms")

# Buat matriks term-document A_counts (kata × buku)
A_counts = build_term_doc_counts(book_tokens, vocab)

# Hitung TF, IDF, TF-IDF
TF = compute_tf(A_counts)               # Term Frequency
IDF = compute_idf(A_counts)             # Inverse Document Frequency
A = compute_tfidf(TF, IDF)              # TF-IDF matrix (kata × buku)
print(f"TF-IDF matrix shape: {A.shape}")

# Tentukan K dinamis untuk SVD (minimal 50, atau setengah dari min dimensi)
K = min(50, min(n_terms, n_books) // 2)
if K > min(n_terms, n_books):
    K = min(n_terms, n_books) - 1  # Pastikan tidak melebihi
print(f"Using K={K} for SVD")

# Truncated SVD
try:
    U_k, Sigma_k, Vt_k = svd_truncated(A, K)  # A ≈ U_k @ Sigma_k @ Vt_k
except Exception as e:
    print(f"Error during SVD: {e}. Periksa matriks A atau nilai K.")
    sys.exit(1)

# Hitung embedding dokumen dan normalisasi
D = doc_embeddings(Vt_k, Sigma_k)
D_norm = normalize_rows(D)

print("LSA model ready.")

# === TES PROGRAM ===
# Search loop
while True:
    q = input("\nMasukkan judul (exit untuk keluar): ").strip()
    if q.lower() == "exit":
        break
    if not q:
        print("Query kosong, coba lagi.")
        continue
    
    # Bangun vektor query
    q_vec = build_query_vector(q, vocab, IDF)
    q_lsa = project_query_to_lsa(q_vec, U_k, Sigma_k)
    
    # Ambil top-k hasil langsung (tanpa redundansi)
    top_idx, top_sims = top_k_similar_docs(q_lsa, D_norm, topn=5)
    
    print("\nTop-5 hasil:")
    if len(top_idx) == 0:
        print("Tidak ada hasil yang relevan.")
    else:
        for idx, sim in zip(top_idx, top_sims):
            print(f"{sim:.4f} | {ids[idx]} | {titles[idx]}")