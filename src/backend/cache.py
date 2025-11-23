import numpy as np
from pathlib import Path

"""
Utility untuk menyimpan & memuat hasil pemrosesan LSA:
- vocab
- A_counts
- TF
- IDF
- TF-IDF matrix (A)
- U_k, Sigma_k, Vt_k
- D_norm (normalized doc embeddings)
"""


def save_lsa_cache(path: Path, vocab, A_counts, TF, IDF, A, U_k, Sigma_k, Vt_k, D_norm):
    """
    Menyimpan semua komponen LSA ke file .npz
    """
    print(f"[CACHE] Saving LSA model to: {path}")

    vocab_keys = np.array(list(vocab.keys()), dtype=object)
    vocab_vals = np.array(list(vocab.values()), dtype=int)

    np.savez(
        path,
        vocab_keys=vocab_keys,
        vocab_vals=vocab_vals,
        A_counts=A_counts,
        TF=TF,
        IDF=IDF,
        A=A,
        U_k=U_k,
        Sigma_k=Sigma_k,
        Vt_k=Vt_k,
        D_norm=D_norm,
    )

    print(f"[CACHE] Saved LSA cache to: {path}")


def load_lsa_cache(path):
    """
    Mengembalikan:
        vocab (dict)
        A_counts, TF, IDF, A
        U_k, Sigma_k, Vt_k, D_norm
    """

    print(f"[CACHE] Loading LSA model from: {path}")
    data = np.load(path, allow_pickle=True)

    # LOAD VOCAB BENAR (bukan array 0-d)
    vocab_keys = data["vocab_keys"].tolist()
    vocab_vals = data["vocab_vals"].tolist()

    vocab = {k: int(v) for k, v in zip(vocab_keys, vocab_vals)}

    return (
        vocab,
        data["A_counts"],
        data["TF"],
        data["IDF"],
        data["A"],
        data["U_k"],
        data["Sigma_k"],
        data["Vt_k"],
        data["D_norm"],
    )
