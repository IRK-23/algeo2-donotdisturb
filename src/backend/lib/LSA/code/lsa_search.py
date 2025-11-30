from __future__ import annotations
from pathlib import Path
from typing import List, Tuple
import numpy as np

# Import fungsi dari folder LSA
from src.backend.lib.LSA.code.preprocessing import (
    tokenize,
    normalize_tokens,
    stem_tokens,
    remove_stopwords,
)

# PATH
SCRIPT_DIR = Path(__file__).resolve().parent
LSA_DIR = SCRIPT_DIR.parent
PAR_DIR = LSA_DIR.parent
CSV_DIR = PAR_DIR / "document"

TFIDF_PATH        = CSV_DIR / "tfidf_matrix.npz"
LSA_FACTORS_PATH  = CSV_DIR / "lsa_svd.npz"
DOC_EMB_PATH      = CSV_DIR / "lsa.npz"

# PREPROCESS QUERY
def preprocess_query(text: str) -> List[str]:
    tokens = tokenize(text)
    normed = normalize_tokens(tokens)
    stemmed = stem_tokens(normed)
    clean = remove_stopwords(stemmed)
    return clean

# BUILD QUERY TF-IDF VECTOR
# tfidf untuk query berdasarkan vocab & idf global
def build_query_tfidf(
    clean_tokens: List[str],
    vocab: List[str],
    idf: np.ndarray,
) -> np.ndarray:
    m = len(vocab)
    term_to_index = {term: i for i, term in enumerate(vocab)}

    counts = np.zeros(m, dtype=float)
    for t in clean_tokens:
        idx = term_to_index.get(t)
        if idx is not None:
            counts[idx] += 1.0

    total = counts.sum()
    if total > 0.0:
        tf = counts / total
    else:
        tf = counts  

    q_tfidf = tf * idf  
    return q_tfidf

# COMPUTE QUERY EMBEDDING
def compute_query_embedding(query_text: str) -> np.ndarray:
    # load vocab & IDF dari hasil TF-IDF 
    tfidf_data = np.load(TFIDF_PATH, allow_pickle=True)
    vocab = tfidf_data["vocab"].tolist()
    idf = tfidf_data["IDF"]             

    # preprocess query
    clean_tokens = preprocess_query(query_text)

    # TF-IDF query 
    q_tfidf = build_query_tfidf(clean_tokens, vocab, idf) 

    # load faktor LSA (Uk, Sk)
    lsa_data = np.load(LSA_FACTORS_PATH, allow_pickle=True)
    Uk = lsa_data["Uk"]                
    Sk = lsa_data["Sk"]                 

    # ukuran harus cocok
    if Uk.shape[0] != q_tfidf.shape[0]:
        raise ValueError(
            f"Dimensi Uk ({Uk.shape[0]}) != dimensi q_tfidf ({q_tfidf.shape[0]})"
        )

    # proyeksi ke ruang laten 
    q_topic = Uk.T @ q_tfidf         
    Sk_safe = Sk.copy()
    Sk_safe[Sk_safe == 0.0] = 1.0       
    q_lsa = q_topic / Sk_safe           

    # normalisasi ke vektor unit 
    norm = np.linalg.norm(q_lsa)
    if norm > 0.0:
        dq_norm = q_lsa / norm
    else:
        dq_norm = q_lsa  

    return dq_norm

# LOAD DOCUMENT EMBEDDINGS
def load_doc_embeddings():
    data = np.load(DOC_EMB_PATH, allow_pickle=True)
    D_norm = data["D_norm"]               
    doc_paths = data["doc_paths"].tolist()
    return D_norm, doc_paths

# SEARCH SIMILAR DOCUMENTS
# Menghitung cosine similarity antara embedding query dan semua embedding dokumen, lalu mengembalikan top_k dokumen paling mirip
def search_similar_documents(
    dq_norm: np.ndarray,
    D_norm: np.ndarray,
    doc_paths: List[str],
    top_k: int = 5,
    remove_self: bool = False,
    self_index: int | None = None,
) -> List[Tuple[int, float, str]]:
    # pastikan dq_norm vektor 1D
    dq_norm = np.asarray(dq_norm, dtype=float).ravel()

    norm = np.linalg.norm(dq_norm)
    if norm > 0.0:
        dq_norm = dq_norm / norm

    # cosine similarity = dot product karena semua vektor sudah unit
    sims = D_norm @ dq_norm  

    # jika ingin mengabaikan dokumen dirinya sendiri
    if remove_self and self_index is not None:
        if 0 <= self_index < sims.shape[0]:
            sims[self_index] = -np.inf

    # urutkan menurun
    sorted_idx = np.argsort(-sims)

    # ambil top_k
    top_k = min(top_k, len(sorted_idx))
    top_indices = sorted_idx[:top_k]

    results: List[Tuple[int, float, str]] = []
    for idx in top_indices:
        score = float(sims[idx])
        path = doc_paths[idx] if idx < len(doc_paths) else ""
        results.append((idx, score, path))

    return results

