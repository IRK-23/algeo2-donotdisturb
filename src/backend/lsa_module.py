import json
import re
import math
import numpy as np
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from collections import Counter

# Fungsi pembuat token (membuang stopword, melakukan stemming)
STOPWORDS = {w.lower() for w in stopwords.words("english")}
ps = PorterStemmer()

def tokenize(text):
    text = text.lower()
    tokens = re.findall(r"[a-z]+", text)                # ambil huruf saja  
    tokens = [t for t in tokens if t not in STOPWORDS]  # buang stopword
    tokens = [ps.stem(t) for t in tokens]               # stemming
    return tokens

# Fungsi pembuat term (kata): {term -> index}
def build_vocab(book_tokens):
    vocab = {}
    for tokens in book_tokens:          # token tiap buku
        for term in tokens:             # kata tiap token
            if term not in vocab:       # tambah kata baru -> index baru
                vocab[term] = len(vocab)
    return vocab

# Fungsi pembuat matriks term-document frequency counts
# term_doc_counts[i][j] = frekuensi kemunculan kata ke-i dalam dokumen ke-j
def build_term_doc_counts(book_tokens, vocab):
    n_terms = len(vocab)        # frekuensi kata unik
    n_books = len(book_tokens)  # frekuensi buku

    term_doc = np.zeros((n_terms, n_books), dtype=np.float32) # baris = kata, kolom = buku

    for j, tokens in enumerate(book_tokens):    # j = index buku, tokens = token buku
        cnt = Counter(tokens)                   # membuat {kata -> frekuensi} untuk buku j
        for term, freq in cnt.items():          # term = kata, freq = frekuensi
            i = vocab[term]                     # i = index kata di vocab   
            term_doc[i][j] = freq               # masukkan frekuensi ke matriks 
    return term_doc

# Fungsi TF (Term Frequency)
def compute_tf(term_doc_counts):
    TF = term_doc_counts.copy().astype(np.float32)  # salin matriks frekuensi
    col_sums = TF.sum(axis=0, keepdims=True)        # jumlah kata per buku (untuk setiap kolom)
    col_sums[col_sums == 0] = 1.0                   # menghindari pembagian 0 (hanya jika kata tidak ada, tidak memungkinkan)
    TF /= col_sums                                  # TF = frekuensi kata unik / total kata dalam buku
    return TF

# Fungsi IDF (Inverse Document Frequency)
def compute_idf(term_doc_counts, n_books):
    df = np.count_nonzero(term_doc_counts > 0, axis=1)      # df = jumlah buku yang mengandung term(i)
    IDF = np.log10(n_books / (1 + df)).astype(np.float32)   # IDF = log10(n / (1 + df))
    return IDF

# Fungsi TF-IDF (Term Frequency - Inverse Document Frequency)
def compute_tfidf(TF, IDF):
    return IDF[:, np.newaxis] * TF


# Fungsi mencari nilai eigen terbesar (agar variansi besar dan bermakna)
def power_iteration_symmetric(M, max_iter=1000, tol=1e-6):
    n = M.shape[0]
    v = np.random.randn(n).astype(np.float32)   # v = vector random
    v /= np.linalg.norm(v)                      # normalisasi v

    lambda_old = 0.0
    for _ in range(max_iter):                   # iterasi sebanyak max_iter
        w = M @ v                               # kalikan M dengan v (@ adalah operator matriks n x n kali vektor n)
        if np.allclose(w, 0):                   # jika w mendekati nol, hentikan    
            break
        v = w / np.linalg.norm(w)               # normalisasi w menjadi v agar v tetap unit vektor
        lam = float(v @ (M @ v))                # lam = nilai eigen menggunakan Rayleigh quotient
        if abs(lam - lambda_old) < tol:         # jika konvergen (perbuahan nilai eigen sangat kecil), hentikan iterasi
            break
        lambda_old = lam
    return lam, v                               # mengembalikan nilai eigen dan vektor eigen


def top_k_eigenpairs(M, k):
    B = M.copy().astype(np.float32)             # salin matriks M ke B
    n = B.shape[0]

    eigvals = []                # daftar nilai eigen
    eigvecs = []                # daftar vektor eigen

    for _ in range(k):          # iterasi sebanyak k kali untuk mendapatkan k pasang eigen
        lam, v = power_iteration_symmetric(B)
        if lam <= 0:            # menghentikan iterasi jika nilai eigen tidak positif (tidak relevan)
            break
        eigvals.append(lam)     # menyimpan daftar vektor eigen
        eigvecs.append(v)       # menyimpan daftar vektor eigen
        B -= lam * np.outer(v, v)   # np.outer(v, v) = v v^T, membuang nilai eigen yang sudah ditemukan

    return np.array(eigvals), np.column_stack(eigvecs)


# Fungsi truncated SVD untuk TF-IDF matrix A (A ≈ U Σ V^T)
def svd_truncated(A, k):
    # A: (terms × books)
    B = A.T @ A  # B = A^T A = (books×books)

    eigvals, V_k = top_k_eigenpairs(B, k)       # V = (1/sigma) A^T u

    sigmas = np.sqrt(np.maximum(eigvals, 0.0))  # eigvals = sigma^2
    U_k = (A @ V_k) / sigmas[np.newaxis, :]     # U = (1/sigma) A v

    return U_k, sigmas, V_k 


# Fungsi vektor TF-IDF dari query
def build_query_vector(text, vocab, IDF):
    tokens = tokenize(text)                         # token teks query
    vec = np.zeros(len(vocab), dtype=np.float32)    # vektor nol dengan panjang vocab

    if not tokens:                          # jika token kosong, vektor nol
        return vec

    cnt = Counter(tokens)                   # menghitung frekuensi token dalam query
    total = sum(cnt.values())               # total token dalam query

    for term, c in cnt.items():             # term = kata, c = frekuensi
        if term in vocab:                   # jika term ada di vocab
            i = vocab[term]                 # i = index term di vocab
            vec[i] = (c / total) * IDF[i]   # TF-IDF = (freq / total terms) * IDF

    return vec

# Fungsi proyeksi query ke ruang LSA
def project_query_to_lsa(q_vec, U_k, sigmas, V_k):
    q_lsa = (q_vec @ U_k) / sigmas  # q_lsa = (q^T U_k) / sigma
    return q_lsa / (np.linalg.norm(q_lsa) + 1e-12)  # normalisasi vektor agar panjang vektor = 1