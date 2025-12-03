from typing import List, Dict, Tuple
from collections import Counter
from pathlib import Path
import json
import numpy as np

# PATH
SCRIPT_DIR = Path(__file__).resolve().parent

LSA_DIR = SCRIPT_DIR.parent

CSV_DIR = LSA_DIR / "csv"

PREPROCESSED_JSON = CSV_DIR / "preprocessed.json"
TERM_DOC_OUTPUT = CSV_DIR / "matrix_term_document.npz"

# LOAD PREPROCESSED DATA
def load_preprocessed_docs(path: Path) -> Tuple[List[List[str]], List[str]]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    docs: List[List[str]] = []
    doc_paths: List[str] = []

    for entry in data:
        tokens = entry.get("tokens", [])
        p = entry.get("path", "")
        docs.append(tokens)
        doc_paths.append(p)

    return docs, doc_paths

# BUILD TERM-DOCUMENT MATRIX
# Membuat list vocab (kata unik)
def build_vocabulary(docs: List[List[str]]) -> List[str]:
    vocab_set = set()
    for tokens in docs:
        vocab_set.update(tokens)

    vocab = sorted(vocab_set) 
    return vocab

# Hitung frekuensi term di satu dokumen
def term_freq_for_doc(tokens: List[str]) -> Counter:
    return Counter(tokens)


# Membangun matriks term-document A (n_terms, n_docs) frekuensi kemunculan term di setiap dokumen
def build_term_document_matrix(
    docs: List[List[str]],
    vocab: List[str],
) -> Tuple[np.ndarray, Dict[str, int]]:
    n_terms = len(vocab)
    n_docs = len(docs)

    # mapping term -> index baris di matriks
    term_to_index: Dict[str, int] = {term: i for i, term in enumerate(vocab)}

    # Inisialisasi matriks term-document
    A = np.zeros((n_terms, n_docs), dtype=np.int32)

    # Isi matriks
    for j, tokens in enumerate(docs):   # j = dokumen (kolom)
        freq = term_freq_for_doc(tokens)
        for term, count in freq.items():
            idx = term_to_index.get(term)
            if idx is not None:
                A[idx, j] = count

    return A, term_to_index

# SAVE MATRIKS TERM-DOCUMENT
def save_term_document_matrix(
    A: np.ndarray,
    vocab: List[str],
    doc_paths: List[str],
    output_path: Path,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    np.savez_compressed(
        output_path,
        A=A,
        vocab=np.array(vocab),
        doc_paths=np.array(doc_paths),
    )

# MAIN FUNCTION
def main():
    docs, doc_paths = load_preprocessed_docs(PREPROCESSED_JSON)
    vocab = build_vocabulary(docs)
    A, _ = build_term_document_matrix(docs, vocab)
    save_term_document_matrix(A, vocab, doc_paths, TERM_DOC_OUTPUT)

if __name__ == "__main__":
    main()

# LIHAT HASIL MATRIKS TERM-DOCUMENT
# def load_term_document_matrix(path: Path):
#     data = np.load(path, allow_pickle=True)
#     A = data["A"]
#     vocab = data["vocab"].tolist()
#     doc_paths = data["doc_paths"].tolist()
#     return A, vocab, doc_paths

# def print_sample_docs_from_matrix(
#     A: np.ndarray,
#     vocab: List[str],
#     doc_paths: List[str],
#     n_docs: int = 5,
#     top_k_terms: int = 10,
# ) -> None:
#     n_terms, n_docs_total = A.shape
#     n_docs_show = min(n_docs, n_docs_total)

#     print(f"Matrix shape: {A.shape} (n_terms x n_docs)")
#     print(f"Total vocab : {len(vocab)}")
#     print(f"Total docs  : {len(doc_paths)}")

#     for j in range(n_docs_show):
#         col = A[:, j]  # semua term untuk dokumen j
#         # indeks term dengan frekuensi > 0
#         nonzero_idx = np.where(col > 0)[0]
#         nonzero_count = len(nonzero_idx)

#         # ambil top-k term berdasarkan frekuensi
#         if nonzero_count > 0:
#             # sort descending by count
#             sorted_idx = nonzero_idx[np.argsort(col[nonzero_idx])[::-1]]
#             top_idx = sorted_idx[:top_k_terms]
#             top_terms = [(vocab[i], int(col[i])) for i in top_idx]
#         else:
#             top_terms = []

#         print("\n==========================")
#         print(f"Dokumen {j}")
#         print(f"Path          : {doc_paths[j]}")
#         print(f"Non-zero term : {nonzero_count}")
#         print("Top terms     :")
#         for term, cnt in top_terms:
#             print(f"  {term:20s} -> {cnt}")

# def main():
#     A, vocab, doc_paths = load_term_document_matrix(TERM_DOC_OUTPUT)
#     print_sample_docs_from_matrix(A, vocab, doc_paths, n_docs=5, top_k_terms=10)