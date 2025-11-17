import json
import re
import math
import numpy as np
import nltk
nltk.download("stopwords")
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from collections import Counter
from .svd_module import svd_truncated

# Fungsi pembuat token (membuang stopword, melakukan stemming)
STOPWORDS = {w.lower() for w in stopwords.words("english")}
ps = PorterStemmer()

def tokenize(text):
    text = text.lower()
    tokens = re.findall(r"[a-z]+", text)                    # ambil huruf saja  
    # tokens = [t for t in tokens if t not in STOPWORDS]    # buang stopword (dicomment karena ada judul yang hanya stopword)
    tokens = [ps.stem(t) for t in tokens]                   # stemming
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
def project_query_to_lsa(q_vec, U_k, sigmas):
    q_lsa = (q_vec @ U_k) / sigmas  # q_lsa = (q^T U_k) / sigma
    return q_lsa / (np.linalg.norm(q_lsa) + 1e-12)  # normalisasi vektor agar panjang vektor = 1