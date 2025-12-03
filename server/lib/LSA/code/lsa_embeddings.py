from pathlib import Path
from typing import List, Tuple
import numpy as np

# PATH
SCRIPT_DIR = Path(__file__).resolve().parent
LSA_DIR = SCRIPT_DIR.parent
CSV_DIR = LSA_DIR / "csv"

LSA_FACTORS_PATH = CSV_DIR / "lsa_svd_k100.npz"   
DOC_EMB_OUTPUT   = CSV_DIR / "lsa_embeddings.npz"

# LOAD LSA
def load_lsa_factors(path: Path):
    data = np.load(path, allow_pickle=True)
    Uk = data["Uk"]                   
    Sk = data["Sk"]                    
    VkT = data["VkT"]                  
    vocab = data["vocab"].tolist()
    doc_paths = data["doc_paths"].tolist()
    return Uk, Sk, VkT, vocab, doc_paths

# HITUNG EMBEDDING: D = V_k * S_k
def compute_document_embeddings(
    Sk: np.ndarray,
    VkT: np.ndarray,
) -> np.ndarray:
    V_k = VkT.T
    D = V_k * Sk[np.newaxis, :]
    return D

# NORMALISASI EMBEDDING
def normalize_document_embeddings(D: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(D, axis=1, keepdims=True)
    norms_safe = norms.copy()
    norms_safe[norms_safe == 0.0] = 1.0

    D_norm = D / norms_safe
    return D_norm

# SAVE EMBEDDINGS
def save_document_embeddings(
    D: np.ndarray,
    D_norm: np.ndarray,
    doc_paths: List[str],
    output_path: Path,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    np.savez_compressed(
        output_path,
        D=D,
        D_norm=D_norm,
        doc_paths=np.array(doc_paths),
    )

# MAIN FUNCTION
def main():
    Uk, Sk, VkT, vocab, doc_paths = load_lsa_factors(LSA_FACTORS_PATH)
    D = compute_document_embeddings(Sk, VkT)
    D_norm = normalize_document_embeddings(D)
    save_document_embeddings(D, D_norm, doc_paths, DOC_EMB_OUTPUT)

if __name__ == "__main__":
    main()

# CEK EMBEDDINGS
# def load_doc_embeddings(path: Path):
#     data = np.load(path, allow_pickle=True)
#     D = data["D"]                  
#     D_norm = data["D_norm"]        
#     doc_paths = data["doc_paths"].tolist()
#     return D, D_norm, doc_paths

# def print_embeddings_summary(D, D_norm, doc_paths):
#     n_docs, k = D.shape
#     print("========== DOC EMBEDDINGS SUMMARY ==========")
#     print(f"D shape      : {D.shape}      (n_docs x k)")
#     print(f"D_norm shape : {D_norm.shape} (n_docs x k)")
#     print(f"Num docs     : {len(doc_paths)}")
#     print(f"Embedding dim: {k}")
#     print("============================================\n")

# def print_sample_embeddings(
#     D,
#     D_norm,
#     doc_paths,
#     n_docs: int = 5,
#     n_dims: int = 10,
# ):
#     n_total_docs, k = D.shape
#     docs_to_show = min(n_docs, n_total_docs)
#     dims_to_show = min(n_dims, k)

#     for i in range(docs_to_show):
#         vec = D[i, :dims_to_show]
#         vec_norm = D_norm[i, :dims_to_show]

#         # norm asli (sebelum normalisasi)
#         norm = float(np.linalg.norm(D[i, :]))

#         print("--------------------------------------------------")
#         print(f"Dokumen {i}")
#         print(f"Path          : {doc_paths[i]}")
#         print(f"Norm D[i]     : {norm:.6f}")
#         print(f"First {dims_to_show} dims (D):")
#         print("  [", ", ".join(f"{x:.6f}" for x in vec), "]")
#         print(f"First {dims_to_show} dims (D_norm):")
#         print("  [", ", ".join(f"{x:.6f}" for x in vec_norm), "]")
#         print()

# def main():
#     D, D_norm, doc_paths = load_doc_embeddings(DOC_EMB_OUTPUT)
#     print_embeddings_summary(D, D_norm, doc_paths)
#     print_sample_embeddings(D, D_norm, doc_paths, n_docs=5, n_dims=10)

# if __name__ == "__main__":
#     main()