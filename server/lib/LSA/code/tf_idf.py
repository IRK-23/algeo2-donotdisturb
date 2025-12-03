from pathlib import Path
from typing import List, Tuple
import numpy as np

# PATH
SCRIPT_DIR = Path(__file__).resolve().parent     
LSA_DIR = SCRIPT_DIR.parent                      
CSV_DIR = LSA_DIR / "csv"                        

TERM_DOC_INPUT = CSV_DIR / "matrix_term_document.npz"
TFIDF_OUTPUT = CSV_DIR / "tfidf_matrix.npz"

# LOAD TERM-DOCUMENT MATRIX
# A = matrix term-document (n_terms, n_docs), vocab, doc_paths
def load_term_document_matrix(path: Path) -> Tuple[np.ndarray, List[str], List[str]]:
    data = np.load(path, allow_pickle=True)
    A = data["A"]
    vocab = data["vocab"].tolist()
    doc_paths = data["doc_paths"].tolist()
    return A, vocab, doc_paths

# COMPUTE TF-IDF MATRIX
def compute_tfidf(A: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    m_terms, n_docs = A.shape

    # TF
    col_sums = A.sum(axis=0)               # total term di setiap dokumen
    col_sums_safe = col_sums.copy()
    col_sums_safe[col_sums_safe == 0] = 1  # supaya tidak div by zero
    TF = A / col_sums_safe 

    # IDF
    df = np.count_nonzero(A>0, axis=1)   # ada berapa dokumen yang punya term i
    IDF = np.log10(n_docs / (1.0 + df))  # menambahkan 1.0 untuk menghindari div by zero

    # TFIDF
    TFIDF = TF * IDF[:, np.newaxis]  

    return TFIDF, IDF

# SAVE TF-IDF MATRIX
def save_tfidf_matrix(
    TFIDF: np.ndarray,
    IDF: np.ndarray,
    vocab: List[str],
    doc_paths: List[str],
    output_path: Path,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    np.savez_compressed(
        output_path,
        TFIDF=TFIDF,
        IDF=IDF,
        vocab=np.array(vocab),
        doc_paths=np.array(doc_paths),
    )

# MAIN FUNCTION
def main():
    A, vocab, doc_paths = load_term_document_matrix(TERM_DOC_INPUT)
    TFIDF, IDF = compute_tfidf(A)
    save_tfidf_matrix(TFIDF, IDF, vocab, doc_paths, TFIDF_OUTPUT)

if __name__ == "__main__":
    main()

# LIHAT HASIL TF-IDF
# def load_tfidf_matrix(path: Path):
#     data = np.load(path, allow_pickle=True)
#     TFIDF = data["TFIDF"]
#     IDF = data["IDF"]
#     vocab = data["vocab"].tolist()
#     doc_paths = data["doc_paths"].tolist()
#     return TFIDF, IDF, vocab, doc_paths

# def print_sample_tfidf(
#     TFIDF,
#     IDF,
#     vocab,
#     doc_paths,
#     n_docs: int = 5,
#     n_terms: int = 10,
# ):
#     m_terms, n_total_docs = TFIDF.shape

#     print("=====================================")
#     print("TF-IDF MATRIX INSPECTION")
#     print("Matrix shape :", TFIDF.shape)
#     print("Total terms  :", len(vocab))
#     print("Total docs   :", len(doc_paths))
#     print("=====================================\n")

#     docs_to_show = min(n_docs, n_total_docs)

#     for doc_id in range(docs_to_show):
#         column = TFIDF[:, doc_id]       # semua term → dokumen ini
#         nonzero_idx = np.where(column > 0)[0]

#         # ambil top-n term dengan bobot terbesar
#         sorted_idx = nonzero_idx[np.argsort(column[nonzero_idx])[::-1]]
#         top_idx = sorted_idx[:n_terms]

#         print("------------------------------------------------------")
#         print(f"Dokumen ke-{doc_id}")
#         print(f"Path     : {doc_paths[doc_id]}")
#         print(f"Non-zero : {len(nonzero_idx)} terms")
#         print("Top terms (term : TF-IDF):")

#         for idx in top_idx:
#             term = vocab[idx]
#             score = column[idx]
#             print(f"  {term:20s} : {score:.6f}")
#         print()

# def main():
#     TFIDF, IDF, vocab, doc_paths = load_tfidf_matrix(TFIDF_OUTPUT)
#     print_sample_tfidf(TFIDF, IDF, vocab, doc_paths, n_docs=5, n_terms=10)