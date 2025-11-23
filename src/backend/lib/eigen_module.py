import numpy as np

# Fungsi untuk mendapat || v ||
def vec_norm(v):
    return np.sqrt(np.sum(v * v))

# Fungsi untuk mengembalikan unit vektor
def normalize(v, tol=1e-12):
    n = vec_norm(v)
    if n < tol:
        return np.zeros_like(v)
    return v / n

# Fungsi power_iteration untuk mendapat 1 eigen value terbesar (M = A A.T)
def power_iteration(M, max_iter=100, eps=1e-9):
    if M.shape[0] == 0:
        return 0.0, np.array([])  # Handle matrix kosong
    
    n = M.shape[0]
    v = np.random.rand(n) # vektor awal random
    v = normalize(v)

    for _ in range(max_iter):
        v_new = M @ v       # M @ v adalah lamda x v jika v adalah vektor eigen
        norm_v_new = vec_norm(v_new)

        if norm_v_new < 1e-12:  # Kasus zero vector
            return 0.0, v

        v_new = normalize(v_new)

        # cek konvergensi
        if vec_norm(v_new - v) < eps:
            v = v_new
            break

        v = v_new

    # Hitung eigenvalue dengan Rayleigh quotient:
    eigenvalue = float(v @ (M @ v))
    return eigenvalue, normalize(v)

# Fungsi untuk menghilangkan eigen vektor sebelumnya
def orthonormalize_against_list(x, vecs, tol=1e-12):
    if len(vecs) == 0:
        return normalize(x)
    
    y = x.astype(float).copy()
    for v in vecs:
        proj = np.dot(v, y)
        y -= proj * v

    nrm = vec_norm(y)
    if nrm < tol:
        return None
    return y / nrm

# Fungsi mencari k nilai eigen terbesar
def top_k_eigen_values(A, k, which, tol=1e-12):
    A = np.array(A, dtype=float)

    if A.size == 0 or k <= 0:
        return np.array([]), np.array([])
    
    if which == 'left':
        M = A @ A.T
    elif which == 'right':
        M = A.T @ A
    else:
        raise ValueError("which must be 'left' or 'right'")

    n = M.shape[0]
    eigenvalues = []
    eigenvectors = []
    M_work = M.copy()   # untuk deflation

    for i in range(k):
        lam, v = power_iteration(M_work, max_iter=500)

        if lam < tol:   # tidak ada eigenvalue besar lagi
            break
        
        eigenvalues.append(lam)
        eigenvectors.append(v)

        # Deflation --> hilangkan kontribusi eigenvalue yang sudah ditemukan
        outer_prod = np.outer(v, v)
        M_work -= lam * outer_prod

    # jika kurang dari k, isi basis ortonormal
    basis = eigenvectors.copy()
    for i in range(n):
        if len(eigenvalues) >= k:
            break
        e = np.zeros(n)
        e[i] = 1.0
        v_new = orthonormalize_against_list(e, basis)
        if v_new is not None:
            eigenvalues.append(0.0)
            eigenvectors.append(v_new)
            basis.append(v_new)

    # hasil
    eigenvalues = np.array(eigenvalues[:k])
    if len(eigenvectors) < k:
        # Kasus langka
        for _ in range(k - len(eigenvectors)):
            eigenvectors.append(np.zeros(n))
    eigenvectors = np.column_stack(eigenvectors[:k])

    return eigenvalues, eigenvectors

# Fungsi mencari k vektor kiri singular
def top_k_left_singular_values(A, k):
    eigenvalues, eigenvectors = top_k_eigen_values(A, k, 'left')
    if eigenvalues.size == 0:
        return np.array([]), np.array([])
    U = eigenvectors   # kolom-kolom = left singular vectors
    return eigenvalues, U

# Fungsi mencari k matriks sigma singular
def top_k_sigma_matrix(eigenvalues, k): 
    if eigenvalues.size == 0:
        return np.array([])
    singular_values = np.sqrt(np.maximum(eigenvalues, 0))
    return np.diag(singular_values[:k])

# Fungsi mencari k vektor kanan singular
def top_k_right_singular_values(A, k):
    eigenvalues, eigenvectors = top_k_eigen_values(A, k, 'right')
    if eigenvalues.size == 0:
        return np.array([]), np.array([])
    V = eigenvectors   # kolom-kolom = right singular vectors
    return eigenvalues, V
