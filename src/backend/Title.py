import json
from lsa_module import *
from pathlib import Path

# Configuration
# path file ini: ../src/backend/Title.py
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent.parent  # naik 2 level ke ALGEO2-DONOTDISTURB

DATASET_JSON = PROJECT_ROOT / "data" / "mapper.json"
K = 50                  # dimensi latent k (<= n_books-1), makin besar, makin akurat tapi lambat
MAX_POWER_ITERS = 1000
POWER_TOL = 1e-6

# Load JSON
with open(DATASET_JSON, "r", encoding="utf-8") as f:
    mapper = json.load(f)

ids = list(mapper.keys())                   # semua id buku
titles = [mapper[i]["title"] for i in ids]  # semua judul buku
n_books = len(titles)
print(f"Loaded {n_books} titles from {DATASET_JSON}")

# Token tiap title   
book_tokens = [tokenize(t) for t in titles] # list of list of tokens

# Buat vocab dari semua token
vocab = build_vocab(book_tokens)
n_terms = len(vocab)                        # jumlah kata unik
n_books = len(book_tokens)                  # jumlah buku

# Buat matriks term-document A_counts (kata × buku)
A_counts = build_term_doc_counts(book_tokens, vocab)

# Mencari TF, IDF, TF-IDF matriks A_counts
TF = compute_tf(A_counts)               # Term Frequency
IDF = compute_idf(A_counts, n_books)    # Inverse Document Frequency 
A = compute_tfidf(TF, IDF)              # TF-IDF matrix (kata × buku)

# Truncated SVD
U_k, sigmas, V_k = svd_truncated(A, K)  # A =  U_k @ Sigma_k @ V_k.T

# Mencari embedding dokumen
doc_embed = (A.T @ U_k) / sigmas        #  D = V_k @ Sigma_k = A.T @ U_k, D_embed = D @ Sigma_k^-1 = A.T @ U_k / Sigma_k 

# Normalisasi aman (menghindari pembagian 0)
norms = np.linalg.norm(doc_embed, axis=1, keepdims=True)
norms[norms == 0] = 1e-10

doc_embed /= norms # normalisasi tiap baris, d_normalisasi = d / ||d||

print("LSA model ready.")       # model siap digunakan (placeholder)

# Search loop
while True:
    q = input("\nMasukkan judul (exit untuk keluar): ").strip()
    if q == "exit":
        break

    q_vec = build_query_vector(q, vocab, IDF)
    q_lsa = project_query_to_lsa(q_vec, U_k, sigmas, V_k)

    sims = doc_embed @ q_lsa
    idx = sims.argsort()[::-1][:5]

    print("\nTop-5 hasil:")
    for i in idx:
        print(f"{sims[i]:.4f} | {ids[i]} | {titles[i]}")