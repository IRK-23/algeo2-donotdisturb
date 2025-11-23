import numpy as np
from .eigen_module import *

# Fungsi SVD
def svd_truncated(A, k):
    A = np.array(A, float)
    eigen_left, U = top_k_left_singular_values(A, k)
    eigen_right, V = top_k_right_singular_values(A, k)
    Sigma = top_k_sigma_matrix(eigen_right, k)
    Vt = V.T
    return U, Sigma, Vt

# import numpy as np

# def svd_truncated(A, k, max_iter=50):
#     """
#     Memory-efficient truncated SVD using randomized algorithm
#     Tidak membuat matriks A.T @ A yang sangat besar
    
#     Args:
#         A: Input matrix (m, n)
#         k: Number of components
#         max_iter: Maximum iterations for power iteration
    
#     Returns:
#         U: Left singular vectors (m, k)
#         sigma: Diagonal matrix of singular values (k, k)
#         Vt: Right singular vectors transposed (k, n)
#     """
#     m, n = A.shape
#     print(f"  SVD Input shape: {A.shape}")
#     print(f"  Computing {k} components with memory-efficient algorithm...")
    
#     # ✅ STRATEGY: Use numpy's SVD with full_matrices=False
#     # This is much more memory efficient than custom power iteration
#     print("  Using numpy.linalg.svd (optimized)...")
    
#     try:
#         # Compute full SVD but only keep what we need
#         U_full, sigma_full, Vt_full = np.linalg.svd(
#             A, 
#             full_matrices=False  # ✅ Critical for memory efficiency
#         )
        
#         print(f"  ✅ Full SVD completed")
#         print(f"     U_full shape: {U_full.shape}")
#         print(f"     sigma_full shape: {sigma_full.shape}")
#         print(f"     Vt_full shape: {Vt_full.shape}")
        
#         # Extract top k components
#         U = U_full[:, :k]
#         sigma_values = sigma_full[:k]
#         Vt = Vt_full[:k, :]
        
#         # Create diagonal matrix for sigma
#         sigma = np.diag(sigma_values)
        
#         print(f"  ✅ Truncated to k={k}")
#         print(f"     U shape: {U.shape}")
#         print(f"     sigma shape: {sigma.shape}")
#         print(f"     Vt shape: {Vt.shape}")
#         print(f"     Top 5 singular values: {sigma_values[:min(5, k)]}")
        
#         return U, sigma, Vt
        
#     except Exception as e:
#         print(f"  ❌ Error in SVD computation: {e}")
#         raise


# # Backup: Randomized SVD implementation (if numpy fails)
# def svd_truncated_randomized(A, k, max_iter=50, random_seed=42):
#     """
#     Randomized SVD - more memory efficient alternative
#     Uses power iteration without forming A.T @ A
#     """
#     m, n = A.shape
#     np.random.seed(random_seed)
    
#     print(f"  Using randomized SVD algorithm...")
#     print(f"  Input shape: {A.shape}, k={k}")
    
#     # Step 1: Random projection
#     Q = np.random.randn(n, k)
#     Q = np.linalg.qr(Q)[0]
    
#     # Step 2: Power iteration
#     for iteration in range(max_iter):
#         # Q = A @ V → (m, k)
#         Y = A @ Q
        
#         # V = A.T @ Y → (n, k)
#         Q_new = A.T @ Y
        
#         # Orthonormalize
#         Q_new = np.linalg.qr(Q_new)[0]
        
#         # Check convergence
#         diff = np.linalg.norm(Q_new - Q)
        
#         if diff < 1e-6:
#             print(f"  Converged at iteration {iteration+1}")
#             break
            
#         Q = Q_new
        
#         if (iteration + 1) % 10 == 0:
#             print(f"  Iteration {iteration+1}/{max_iter}, diff={diff:.6f}")
    
#     # Step 3: Compute B = A @ Q
#     B = A @ Q
    
#     # Step 4: Small SVD on B
#     U_small, sigma_values, Vt_small = np.linalg.svd(B, full_matrices=False)
    
#     # Step 5: Recover full SVD
#     U = U_small[:, :k]
#     sigma = np.diag(sigma_values[:k])
#     V = Q @ Vt_small.T
#     Vt = V.T[:k, :]
    
#     print(f"  ✅ Randomized SVD completed")
#     print(f"     U shape: {U.shape}")
#     print(f"     sigma shape: {sigma.shape}")
#     print(f"     Vt shape: {Vt.shape}")
    
#     return U, sigma, Vt