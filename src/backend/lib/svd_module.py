import numpy as np

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