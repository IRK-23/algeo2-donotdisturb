from __future__ import annotations
from typing import Tuple
import numpy as np

class SVD:
    @staticmethod
    # QR Decomposition 
    # Input => A : matriks (n x n) atau (m x n)
    # Output => Q, R : Q (m x n) orthogonal, R (n x n)upper triangular
    def qr_decomposition(A: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        A = A.astype(np.float)
        m, n = A.shape
        Q = np.zeros((m, n), dtype=float)
        R = np.zeros((n, n), dtype=float)

        for j in range(n):
            v = A[:,j].copy()
            # hilangkan komponen ke arah kolom-kolom Q sebelumnya
            for i in range(j):
                R[i, j] = np.dot(Q[:, i], v)
                v = v - R[i, j] * Q[:, i]

            norm_v = np.linalg.norm(v)
            if norm_v < 1e-12:
                R[j, j] = 0.0
                Q[:, j] = 0.0
            else:
                R[j, j] = norm_v
                Q[:, j] = v / R[j, j]
        return Q, R
    
    @staticmethod
    # Eigenvalue Decomposition menggunakan QR Algorithm
    # Input => A : matriks simetris (n x n)
    # Output => eigenvalues, eigenvectors
    def eigen_symmetric(
        A: np.ndarray,
        max_iter: int = 1000,
        tol: float = 1e-10,
    ) -> Tuple[np.ndarray, np.ndarray]:
        A = A.astype(float)
        n, m = A.shape
        if n != m:
            raise ValueError("eigen_symmetric hanya untuk matriks bujursangkar")

        # paksa simetris secara numerik 
        B = 0.5 * (A + A.T)
        Q_total = np.eye(n)

        for _ in range(max_iter):
            Q, R = LinAlgUtils.qr_decomposition(B)
            B_next = R @ Q
            Q_total = Q_total @ Q

            # cek konvergensi (perubahan B kecil)
            diff = np.linalg.norm(B_next - B, ord="fro")
            B = B_next
            if diff < tol:
                break

        eigenvalues = np.diag(B)
        eigenvectors = Q_total

        # urutkan dari nilai eigen terbesar ke kecil
        idx = np.argsort(eigenvalues)[::-1]
        eigenvalues = eigenvalues[idx]
        eigenvectors = eigenvectors[:, idx]

        return eigenvalues, eigenvectors
    
    @staticmethod
    # Fungsi SVD untuk matriks A (A ≈ U Σ V^T)
    # Input => A : matriks (m x n)
    # Output => U, S, Vt : U (m x r), S (r,), Vt (r x n) dengan r = rank(A)
    def svd(
        A: np.ndarray,
        tol: float = 1e-10,
        max_iter: int = 1000,
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        A = A.astype(float)
        m, n = A.shape

        if m >= n:
            B = A.T @ A           
            evals, V = SVD.eigen_symmetric(
                B, max_iter=max_iter, tol=tol
            )
            # nilai eigen bisa negatif sangat kecil karena error numerik → clip ke 0
            evals = np.clip(evals, 0.0, None)
            S_all = np.sqrt(evals)

            # singkirkan singular value yang sangat kecil
            keep = S_all > tol
            S = S_all[keep]          
            V = V[:, keep]         

            # U = A V / S
            U = A @ V               
            U /= S[np.newaxis, :]   

        else:
            # kerja di ruang term: B = A A^T (m x m)
            B = A @ A.T
            evals, U = SVD.eigen_symmetric(
                B, max_iter=max_iter, tol=tol
            )
            evals = np.clip(evals, 0.0, None)
            S_all = np.sqrt(evals)

            keep = S_all > tol
            S = S_all[keep]          
            U = U[:, keep]          

            # V = A^T U / S
            V = A.T @ U             
            V /= S[np.newaxis, :]

        Vt = V.T                     

        return U, S, Vt
    
    @staticmethod
    # Fungsi Truncated SVD untuk matriks A
    # Input => A : matriks (m x n), k : jumlah komponen utama yang diinginkan
    # Output => U_k, S_k, Vt_k : U_k (m x k), S_k (k,), Vt_k (k x n)
    def svd_truncated(
        A: np.ndarray,
        k: int,
        tol: float = 1e-10,
        max_iter: int = 1000,
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        U, S, Vt = SVD.svd(A, tol=tol, max_iter=max_iter)

        k_eff = min(k, len(S))
        U_k = U[:, :k_eff]
        S_k = S[:k_eff]
        Vt_k = Vt[:k_eff, :]

        return U_k, S_k, Vt_k