import numpy as np
from .token_module import tokenize
from .eigen_module import vec_norm, normalize
from collections import Counter

# Fungsi vektor TF-IDF dari query
def build_query_vector(text, vocab, IDF):
    tokens = tokenize(text)
    vec = np.zeros(len(vocab), dtype=float)
    if not tokens:
        return vec

    cnt = Counter(tokens)
    total = sum(cnt.values())

    for term, c in cnt.items():
        if term in vocab:
            i = vocab[term]
            vec[i] = (c / total) * IDF[i]

    return vec

# Fungsi proyeksi query ke ruang LSA
def project_query_to_lsa(q_vec, U_k, Sigma_k):
    # ambil singular values
    sigma = np.diag(Sigma_k)

    # U_k: (terms × k)
    # q_vec: (terms)
    q_u = U_k.T @ q_vec   # (k)
    q_u = q_u / sigma     # pembagian elemen-wise

    return normalize(q_u)

# Fungsi membuat representasi tiap dokumen (embedded documents)
def doc_embeddings(Vt_k, Sigma_k):
    D = Vt_k.T @ Sigma_k    # (docs × k)
    return D    

# Fungsi untuk menormalisasi setiap baris
def normalize_rows(M):
    out = np.zeros_like(M)
    for i in range(M.shape[0]):
        row = M[i]
        nrm = np.sqrt(np.sum(row * row))
        if nrm < 1e-12:
            out[i] = row
        else:
            out[i] = row / nrm
    return out

# Fungsi untuk menghitung cosine similarity antara vektor kueri dengan seluruh embedding dokumen
def cosine_similarities_for(q_vec, D_norm):
    return D_norm @ q_vec

# Fungsi untuk mengambil k dokumen paling mirip berdasarkan nilai cosine similarity
def top_k_similar_docs(q_vec_lsa, D_norm, topn=5):
    sims = D_norm @ q_vec_lsa
    order = np.argsort(-sims)
    top_idx = order[:topn]
    return top_idx, sims[top_idx]