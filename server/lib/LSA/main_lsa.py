from pathlib import Path
import numpy as np
import os

from lib.LSA.code.preprocessing import (
    load_raw_documents,
    preprocessing,
)
from lib.LSA.code.matrix_term_document import (
    build_vocabulary,
    build_term_document_matrix,
)
from lib.LSA.code.tf_idf import (
    compute_tfidf,
)
from lib.LSA.code.lsa import (
    compute_lsa_svd,
)
from lib.LSA.code.lsa_embeddings import (
    compute_document_embeddings,
    normalize_document_embeddings,
    save_document_embeddings,
)

SCRIPT_DIR = Path(__file__).resolve().parent          # .../LSA/code
LSA_DIR    = SCRIPT_DIR.parent                        # .../LSA
CSV_DIR    = LSA_DIR / "document"                          # .../LSA/csv

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(ROOT_DIR, "data", "txt")

TFIDF_OUTPUT       = CSV_DIR / "tfidf_matrix.npz"     
LSA_FACTORS_OUTPUT = CSV_DIR / "lsa_svd.npz"         
DOC_EMB_OUTPUT     = CSV_DIR / "lsa.npz"            

K = 100    
TOL = 1e-6
MAX_ITER = 500  


def main():
    CSV_DIR.mkdir(parents=True, exist_ok=True)

    raw_documents, doc_paths = load_raw_documents(DATA_DIR)

    clean_docs = preprocessing(raw_documents)

    vocab = build_vocabulary(clean_docs)
    A, term_to_index = build_term_document_matrix(clean_docs, vocab)
   
    TFIDF, IDF = compute_tfidf(A)

    np.savez(
        TFIDF_OUTPUT,
        TFIDF=TFIDF,
        vocab=np.array(vocab, dtype=object),
        IDF=IDF,
        doc_paths=np.array(doc_paths, dtype=object),
    )
    print(f"[INFO] TF-IDF disimpan ke: {TFIDF_OUTPUT}")

    Uk, Sk, VkT = compute_lsa_svd(
        TFIDF,
        k=K,
    )

    np.savez(
        LSA_FACTORS_OUTPUT,
        Uk=Uk,
        Sk=Sk,
        VkT=VkT,
    )
    print(f"[INFO] Faktor LSA (Uk, Sk, VkT) disimpan ke: {LSA_FACTORS_OUTPUT}")

    D = compute_document_embeddings(Sk, VkT)     
    D_norm = normalize_document_embeddings(D)     
    save_document_embeddings(
        D=D,
        D_norm=D_norm,
        doc_paths=doc_paths,
        output_path=DOC_EMB_OUTPUT,
    )
    print(f"[INFO] Embedding dokumen disimpan ke: {DOC_EMB_OUTPUT}")


if __name__ == "__main__":
    main()
