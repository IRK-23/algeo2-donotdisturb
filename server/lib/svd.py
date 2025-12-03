import numpy as np
import os
import json

class SVD:
    # ============================================================
    #  LOAD PRE-SVD DATA
    # ============================================================
    @staticmethod
    def load_pre_svd_model(model_dir):
        X_norm = np.load(os.path.join(model_dir, "X_norm.npy"))
        mean = np.load(os.path.join(model_dir, "mean.npy"))
        M = np.load(os.path.join(model_dir, "M_matrix.npy"))

        with open(os.path.join(model_dir, "metadata.json"), "r") as f:
            metadata = json.load(f)

        return X_norm, mean, M, metadata


    # ============================================================
    #  POWER ITERATION (1 VEKTOR EIGEN)
    # ============================================================
    @staticmethod
    def power_iteration(M, num_iter=3000, tol=1e-6):
        n = M.shape[0]
        v = np.random.rand(n).astype(np.float64)
        v /= np.linalg.norm(v)

        for _ in range(num_iter):
            v_new = M @ v
            norm = np.linalg.norm(v_new)

            if norm == 0:
                return v, 0.0

            v_new /= norm
            if np.linalg.norm(v_new - v) < tol:
                break

            v = v_new

        eigenvalue = float(v.T @ M @ v)
        return v, eigenvalue


    # ============================================================
    #  POWER ITERATION K VEKTOR (DEFLATION)
    # ============================================================
    @staticmethod   
    def power_iteration_k(M, k, num_iter=3000):
        n = M.shape[0]
        eigenvectors = []
        eigenvalues = []

        A = M.copy().astype(np.float64)

        for _ in range(k):
            v, eigenvalue = SVD.power_iteration(A, num_iter=num_iter)

            eigenvectors.append(v)
            eigenvalues.append(eigenvalue)

            # Deflation
            A = A - eigenvalue * np.outer(v, v)

        eigenvectors = np.array(eigenvectors).T   # shape = n × k
        eigenvalues = np.array(eigenvalues)

        return eigenvectors, eigenvalues



    # ============================================================
    #  HITUNG U DAN SIGMA (DARI V DAN LAMBDA)
    # ============================================================
    @staticmethod
    def compute_U(X_norm, V, eigenvalues):
        k = V.shape[1]
        d = X_norm.shape[0]

        U = np.zeros((d, k))

        for i in range(k):
            lam = eigenvalues[i]
            if lam <= 0:
                continue

            sigma = np.sqrt(lam)
            u = (X_norm @ V[:, i]) / sigma
            U[:, i] = u

        # Normalisasi kolom
        for i in range(k):
            norm = np.linalg.norm(U[:, i])
            if norm != 0:
                U[:, i] /= norm

        return U


    # ============================================================
    #  FULL PCA SVD PIPELINE
    # ============================================================
    @staticmethod
    def create_svd_model1(model_dir_pre, k=50):
        print("=== MEMUAT DATA PRE-SVD ===")
        X_norm, mean, M, metadata = SVD.load_pre_svd_model(model_dir_pre)

        print("X_norm shape:", X_norm.shape)
        print("M shape:", M.shape)
        print("Jumlah komponen PCA yang diminta:", k)

        print("\n=== POWER ITERATION (mengambil V dan lambda) ===")
        V, eigenvalues = SVD.power_iteration_k(M, k)

        print("V shape =", V.shape)            # (523 × k)
        print("Eigenvalues =", eigenvalues[:10], "...")

        sigma = np.sqrt(eigenvalues)

        print("\n=== MENGHITUNG U ===")
        U = SVD.compute_U(X_norm, V, eigenvalues)
        print("U shape =", U.shape)            # (60000 × k)

        # ============================================================
        # SIMPAN MODEL
        # ============================================================

        out_dir = os.path.join(os.path.dirname(model_dir_pre), "pca_model_test")
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)

        np.save(os.path.join(out_dir, "U.npy"), U)
        np.save(os.path.join(out_dir, "V.npy"), V)
        np.save(os.path.join(out_dir, "sigma.npy"), sigma)

        new_meta = {
            "k": k,
            "original_metadata": metadata
        }

        with open(os.path.join(out_dir, "metadata.json"), "w") as f:
            json.dump(new_meta, f, indent=4)

        print("\n=== PCA SVD SELESAI ===")
        print("Model tersimpan di:", out_dir)

    # LSA
    # ============================================================
    #  POWER ITERATION (1 VEKTOR EIGEN)
    # ============================================================
    @staticmethod
    def power_iteration_lsa(M: np.ndarray, num_iter: int = 3000, tol: float = 1e-6):
        n = M.shape[0]
        v = np.random.rand(n).astype(np.float64)
        v /= np.linalg.norm(v)

        for _ in range(num_iter):
            v_new = M @ v
            norm = np.linalg.norm(v_new)

            if norm == 0:
                # Matriks mengirim v ke vektor nol -> eigenvalue 0
                return v, 0.0

            v_new /= norm
            # cek konvergensi
            if np.linalg.norm(v_new - v) < tol:
                v = v_new
                break

            v = v_new

        eigenvalue = float(v.T @ M @ v)
        return v, eigenvalue

    # ============================================================
    #  POWER ITERATION K VEKTOR (DEFLATION)
    # ============================================================
    @staticmethod
    def power_iteration_k_lsa(M: np.ndarray, k: int, num_iter: int = 3000, tol: float = 1e-6):
        n = M.shape[0]
        eigenvectors = []
        eigenvalues = []

        A = M.astype(np.float64).copy()

        for _ in range(k):
            v, eigenvalue = SVD.power_iteration_lsa(A, num_iter=num_iter, tol=tol)
            eigenvectors.append(v)
            eigenvalues.append(eigenvalue)

            A = A - eigenvalue * np.outer(v, v)

        eigenvectors = np.array(eigenvectors).T   
        eigenvalues = np.array(eigenvalues)      
        return eigenvectors, eigenvalues

    # ============================================================
    #  TRUNCATED SVD UNTUK LSA
    # ============================================================
    @staticmethod
    def truncated_svd(A: np.ndarray, k: int, num_iter: int = 3000, tol: float = 1e-6):
        A = A.astype(np.float64)
        m, n = A.shape

        if k > min(m, n):
            raise ValueError(f"k = {k} tidak boleh lebih besar dari min(m, n) = {min(m, n)}")
        
        if m >= n:
            M = A.T @ A   

            V, eigenvalues = SVD.power_iteration_k_lsa(M, k, num_iter=num_iter, tol=tol)

            idx = np.argsort(-eigenvalues)
            eigenvalues = eigenvalues[idx]
            V = V[:, idx]

            eigenvalues_clamped = np.maximum(eigenvalues, 0.0)
            S = np.sqrt(eigenvalues_clamped)     

            U = np.zeros((m, k), dtype=np.float64)
            for i in range(k):
                if S[i] > 0:
                    u = A @ V[:, i] / S[i]
                    norm = np.linalg.norm(u)
                    if norm > 0:
                        u = u / norm
                    U[:, i] = u

            Vt = V.T   # shape (k, n)
        else:
            M = A @ A.T    

            U, eigenvalues = SVD.power_iteration_k_lsa(M, k, num_iter=num_iter, tol=tol)
            idx = np.argsort(-eigenvalues)
            eigenvalues = eigenvalues[idx]
            U = U[:, idx]

            eigenvalues_clamped = np.maximum(eigenvalues, 0.0)
            S = np.sqrt(eigenvalues_clamped)

            V = np.zeros((n, k), dtype=np.float64)
            for i in range(k):
                if S[i] > 0:
                    v = A.T @ U[:, i] / S[i]
                    norm = np.linalg.norm(v)
                    if norm > 0:
                        v = v / norm
                    V[:, i] = v

            Vt = V.T

        return U, S, Vt