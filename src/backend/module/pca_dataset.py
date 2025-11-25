import os
import numpy as np

def precompute_dataset_coefficients(model_svd_dir):
    print("=== MEMUAT SVD MODEL ===")

    U = np.load(os.path.join(model_svd_dir, "U.npy"))
    sigma = np.load(os.path.join(model_svd_dir, "sigma.npy"))
    V = np.load(os.path.join(model_svd_dir, "V.npy"))
    X_norm = np.load(os.path.join(model_svd_dir, "X_norm.npy"))

    # Menghitung: C = Uᵀ * X_norm
    C_dataset = U.T @ X_norm

    # Simpan
    np.save(os.path.join(model_svd_dir, "C_dataset.npy"), C_dataset)
    
    print("C_dataset.npy berhasil dibuat!")
    print("Shape C_dataset:", C_dataset.shape)