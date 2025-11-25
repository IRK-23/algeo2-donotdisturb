# main_test.py
import os
import json
from module.pca1 import create_pca_model1
from module.svd1 import create_svd_model1
from module.pca_dataset import precompute_dataset_coefficients
from module.query import process_query, load_and_preprocess_query

if __name__ == "__main__":

    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    DATA_DIR = os.path.join(ROOT_DIR, "data", "covers")
    MODEL_DIR = os.path.join(ROOT_DIR, "src", "backend", "model", "pca_model_test")
    QUERY_DIR = os.path.join(ROOT_DIR, "data", "query")
    COVER_DIR = os.path.join(ROOT_DIR, "data", "covers")
    MAPPER_PATH = os.path.join(ROOT_DIR, "data", "mapper.json")
    QUERY_PATH = os.path.join(QUERY_DIR, "query.jpg")

    if not os.path.exists(MODEL_DIR):
        print("ERROR: Folder model PCA tidak ditemukan:", MODEL_DIR)

    else:
        print("=== STARTING PCA FULL PIPELINE ===")

        print("\n[1] PREPROCESSING PCA (Membuat X_norm, mean, M)")
        # create_pca_model1()
        print("\n[2] PREPROCESSING SVD (Membuat U, Sigma, V)")
        # create_svd_model1(MODEL_DIR, k=100)   
        print("\n[3] PREPROCESSING dataset (Membuat C_dataset)")
        # precompute_dataset_coefficients(MODEL_DIR)
        print("\n[4] PROCESSING QUERY")
        results = process_query(QUERY_PATH, MODEL_DIR, top_k=10)
        with open(MAPPER_PATH, "r") as f:
            mapper = json.load(f)
        image_files = sorted(os.listdir(COVER_DIR))
        book_ids = [fname.split('.')[0] for fname in image_files]  

        print("\n=== TOP RESULTS ===\n")
        print("Rank | Index | Distance")
        print("------------------------")
        for i, (idx, dist) in enumerate(results, 1):
            book_id = book_ids[idx]
            title = mapper[book_id]["title"]
            print(f"{i:4} | {book_id:5} | {title} | distance =  {dist:.4f}")

    print("\n=== PCA MODEL FINISHED SUCCESSFULLY ===")
