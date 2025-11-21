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