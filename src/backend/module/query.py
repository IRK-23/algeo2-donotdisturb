import os
import numpy as np
from PIL import Image
from .pca1 import image_to_matrix, convert_to_grayscale, matrix_to_column_vector, normalization


# ============================================================
# Helper: convert query image -> grayscale -> 200x300 -> vector
# ============================================================

def load_and_preprocess_query(img_path, mean_vec, model_svd_dir):
    img = Image.open(img_path)
    rgb = image_to_matrix(img)
    grayscale = convert_to_grayscale(rgb)

    # 2. Jadikan vektor kolom (60000, 1)
    vector = matrix_to_column_vector(grayscale).reshape(-1, 1)  # (60000, 1)

    # 3. Normalisasi (x' = x - mean)
    vnorm = vector - mean_vec  # dua2nya kolom (60000, 1)

    U = np.load(os.path.join(model_svd_dir, "U.npy"))  # (60000, k)

    # 5. Hitung koefisien PCA
    #    cq = U^T x'
    cq = U.T @ vnorm   # shape (k, 1)

    return img, cq




# =====================================================================
#   PROCESS QUERY (mengikuti formula 2.1.5)
# =====================================================================

def process_query(query_path, model_svd_dir, top_k=5):
    """
    Mengembalikan top-k gambar paling mirip dengan query
    berdasarkan PCA coefficient & Euclidean distance.
    """

    # ===========================
    # 1. Load PCA model
    # ===========================
    U = np.load(os.path.join(model_svd_dir, "U.npy"))       # (60000 x k)
    C_dataset = np.load(os.path.join(model_svd_dir, "C_dataset.npy"))  # (k x N)
    mean_vec = np.load(os.path.join(model_svd_dir, "mean.npy"))

    # ===========================
    # 2. Preprocess query image
    # ===========================
    print("Start loading")
    _, cq = load_and_preprocess_query(query_path, mean_vec, model_svd_dir)   # (60000 x 1)
    print("Finish loading")
    # ===========================
    # 3. Hitung koefisien PCA query
    #    cq = U^T x'_q         (sesuai rumus 13)
    # ===========================
    # cq = U.T @ xq_norm_vec          # shape (k x 1)
    # cq = cq.reshape(-1)             # flatten ke (k,)

    # ===========================
    # 4. Hitung jarak Euclidean
    #    di = || cq - ci ||2       (sesuai rumus 14)
    # ===========================
    cq = cq.flatten()   # dari (100,1) → (100,)
    distances = np.linalg.norm(C_dataset.T - cq, axis=1)   # hasil N x 1

    # ===========================
    # 5. Ambil top-k indeks terkecil
    # ===========================
    best_indices = np.argsort(distances)[:top_k]
    best_distances = distances[best_indices]

    # Kembalikan daftar hasil
    return list(zip(best_indices, best_distances))
