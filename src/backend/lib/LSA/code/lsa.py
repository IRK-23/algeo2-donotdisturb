from pathlib import Path
from typing import List, Tuple
import numpy as np
from svd import SVD

# PATH
SCRIPT_DIR = Path(__file__).resolve().parent       
LSA_DIR = SCRIPT_DIR.parent                        
CSV_DIR = LSA_DIR / "csv"                         

TFIDF_INPUT = CSV_DIR / "tfidf_matrix.npz"
LSA_OUTPUT  = CSV_DIR / "lsa_svd_k100.npz" 

# LOAD TF-IDF MATRIX
def load_tfidf_matrix(path: Path) -> Tuple[np.ndarray, List[str], List[str]]:
    data = np.load(path, allow_pickle=True)
    TFIDF = data["TFIDF"]              # shape: (m_terms, n_docs)
    vocab = data["vocab"].tolist()
    doc_paths = data["doc_paths"].tolist()
    return TFIDF, vocab, doc_paths

# LSA dengan SVD
def compute_lsa_svd(
    A: np.ndarray,
    k: int,
    tol: float = 1e-10,
    max_iter: int = 1000,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    Uk, Sk, VkT = SVD.svd_truncated(
        A,
        k=k,
        tol=tol,
        max_iter=max_iter,
    )
    return Uk, Sk, VkT

# SAVE LSA SVD RESULT
def save_lsa_factors(
    Uk: np.ndarray,
    Sk: np.ndarray,
    VkT: np.ndarray,
    vocab: List[str],
    doc_paths: List[str],
    output_path: Path,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    np.savez_compressed(
        output_path,
        Uk=Uk,
        Sk=Sk,
        VkT=VkT,
        vocab=np.array(vocab),
        doc_paths=np.array(doc_paths),
    )

# MAIN FUNCTION
def build_lsa_from_tfidf(k: int = 100, tol: float=1e-10, max_iter: int=1000) -> None:
    TFIDF, vocab, doc_paths = load_tfidf_matrix(TFIDF_INPUT)
    Uk, Sk, VkT = compute_lsa_svd(TFIDF, k=k, tol=tol, max_iter=max_iter)
    save_lsa_factors(Uk, Sk, VkT, vocab, doc_paths, LSA_OUTPUT)

if __name__ == "__main__":
    build_lsa_from_tfidf(k=100, tol=1e-10, max_iter=1000)

# CEK HASIL LSA
# def load_lsa(path: Path):
#     data = np.load(path, allow_pickle=True)
#     Uk = data["Uk"]
#     Sk = data["Sk"]
#     VkT = data["VkT"]
#     vocab = data["vocab"].tolist()
#     doc_paths = data["doc_paths"].tolist()
#     return Uk, Sk, VkT, vocab, doc_paths

# def print_lsa_summary(Uk, Sk, VkT, vocab, doc_paths):
#     print("========== LSA SUMMARY ==========")
#     print(f"Uk shape    : {Uk.shape}   (terms x topics)")
#     print(f"Sk length   : {Sk.shape}   (topics)")
#     print(f"VkT shape   : {VkT.shape}  (topics x docs)")
#     print(f"Vocab size  : {len(vocab)} terms")
#     print(f"Num docs    : {len(doc_paths)}")
#     print("=================================\n")

# def print_sample_topics(
#     Uk,
#     Sk,
#     vocab,
#     n_topics: int = 5,
#     n_terms: int = 10,
# ):
#     m_terms, k = Uk.shape
#     topics_to_show = min(n_topics, k)

#     print("========== SAMPLE TOPICS ==========\n")

#     for t in range(topics_to_show):
#         col = Uk[:, t]  
#         idx_sorted = np.argsort(np.abs(col))[::-1]
#         top_idx = idx_sorted[:n_terms]

#         print(f"Topic {t}  (singular value = {float(Sk[t]):.4f})")
#         print("Top terms:")
#         for idx in top_idx:
#             term = vocab[idx]
#             weight = float(col[idx])
#             print(f"  {term:20s} : {weight:+.6f}")
#         print()

# def print_sample_docs(
#     VkT,
#     doc_paths,
#     n_docs: int = 5,
#     n_topics: int = 5,
# ):
#     k, n_docs_total = VkT.shape
#     docs_to_show = min(n_docs, n_docs_total)

#     print("========== SAMPLE DOCUMENTS ==========\n")

#     for j in range(docs_to_show):
#         col = VkT[:, j]  # semua topic untuk dokumen j
#         idx_sorted = np.argsort(np.abs(col))[::-1]
#         top_idx = idx_sorted[:n_topics]

#         print(f"Dokumen {j}")
#         print(f"Path : {doc_paths[j]}")
#         print("Top topics (topic_id : weight):")
#         for t in top_idx:
#             weight = float(col[t])
#             print(f"  topic {t:3d} : {weight:+.6f}")
#         print()

# def main():
#     Uk, Sk, VkT, vocab, doc_paths = load_lsa(LSA_OUTPUT)

#     print_lsa_summary(Uk, Sk, VkT, vocab, doc_paths)
#     print_sample_topics(Uk, Sk, vocab, n_topics=5, n_terms=10)
#     print_sample_docs(VkT, doc_paths, n_docs=5, n_topics=5)


# if __name__ == "__main__":
#     main()