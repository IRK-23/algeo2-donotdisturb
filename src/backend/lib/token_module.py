import re
import numpy as np
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from collections import Counter

# Untuk mengenal stopword, download jika belum ada
try:
    STOPWORDS = set(stopwords.words("english"))
except LookupError:
    import nltk
    nltk.download("stopwords")
    STOPWORDS = set(stopwords.words("english"))

# Untuk melakukan stemming
ps = PorterStemmer()

def tokenize(text):
    text = text.lower()
    # tokens = re.findall(r"[a-z0-9]+", text)                 # ambil huruf dan angka (optional)
    tokens = re.findall(r"[a-z]+", text)                  # ambil huruf saja (optional)
    tokens = [t for t in tokens if t not in STOPWORDS]    # buang stopword (optional)
    tokens = [ps.stem(t) for t in tokens]                 # stemming (optional)
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
# term_doc[i][j] = frekuensi kemunculan kata ke-i dalam dokumen ke-j
def build_term_doc_counts(book_tokens, vocab):
    n_terms = len(vocab)        # frekuensi kata unik
    n_books = len(book_tokens)  # frekuensi buku

    term_doc = np.zeros((n_terms, n_books), dtype=np.float32) # baris = kata, kolom = buku, matriks nol

    for j, tokens in enumerate(book_tokens):    # j = index buku, tokens = token buku
        cnt = Counter(tokens)                   # membuat {kata -> frekuensi} untuk buku j
        for term, freq in cnt.items():          # term = kata, freq = frekuensi
            i = vocab[term]                     # i = index kata di vocab   
            term_doc[i][j] = freq               # masukkan frekuensi ke matriks 
    return term_doc