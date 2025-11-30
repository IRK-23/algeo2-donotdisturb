import os
import numpy as np
import csv
import json

def save_c_dataset_with_header(model_svd_dir, C_dataset, ids):
    csv_path = os.path.join(model_svd_dir, "C_dataset.csv")

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        header = ["component"] + ids
        writer.writerow(header)

        for comp_idx, row in enumerate(C_dataset):
            writer.writerow([comp_idx] + list(row))

    print("C_dataset.csv dengan header ID berhasil dibuat!")

def precompute_dataset_coefficients(model_svd_dir):
    print("=== MEMUAT SVD MODEL ===")

    U = np.load(os.path.join(model_svd_dir, "U.npy"))
    sigma = np.load(os.path.join(model_svd_dir, "sigma.npy"))
    V = np.load(os.path.join(model_svd_dir, "V.npy"))
    X_norm = np.load(os.path.join(model_svd_dir, "X_norm.npy"))

    # Menghitung: C = Uᵀ * X_norm
    C_dataset = U.T @ X_norm

    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    MAPPER_PATH = os.path.join(ROOT_DIR, "data", "mapper.json")
    with open(MAPPER_PATH, "r", encoding="utf-8") as f:
        mapper = json.load(f)

    ids = list(mapper.keys())

    # Simpan
    np.save(os.path.join(model_svd_dir, "C_dataset.npy"), C_dataset)
    save_c_dataset_with_header(model_svd_dir, C_dataset, ids)
    
    print("C_dataset.npy berhasil dibuat!")
    print("C_dataset.csv berhasil dibuat!")
    print("Shape C_dataset:", C_dataset.shape)