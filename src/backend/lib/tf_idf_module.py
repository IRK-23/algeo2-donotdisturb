import numpy as np

# Fungsi TF (Term Frequency)
def compute_tf(term_doc_counts):
    TF = term_doc_counts.copy().astype(np.float32)  # salin matriks frekuensi
    col_sums = TF.sum(axis=0, keepdims=True)        # jumlah kata per buku (untuk setiap kolom)
    col_sums[col_sums == 0] = 1                     # menghindari pembagian 0 (hanya jika kata tidak ada, tidak memungkinkan)
    TF /= col_sums                                  # TF = frekuensi kata unik / total kata dalam buku
    return TF

# Fungsi IDF (Inverse Document Frequency)
def compute_idf(term_doc_counts):
    n_docs = term_doc_counts.shape[1]                       # ambil jumlah kolom (yaitu docs/buku)
    df = np.count_nonzero(term_doc_counts > 0, axis=1)      # df = jumlah buku yang mengandung term(i)
    IDF = np.log10(n_docs / (1 + df))                       # IDF = log10(n / (1 + df))
    return IDF.astype(np.float32)

# Fungsi TF-IDF (Term Frequency - Inverse Document Frequency) menggunakan diagonal IDF
def compute_tfidf(TF, IDF):
    IDF_diag = np.diag(IDF)       # bentuk (m × m)
    return IDF_diag @ TF          # hasil: (m × n)