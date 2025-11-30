# main_test.py
import os
import json
from lib.PCA.pca import PCA
from lib.svd import SVD
from lib.PCA.pca_dataset import precompute_dataset_coefficients
from lib.PCA.query_pca import process_query, load_and_preprocess_query

if __name__ == "__main__":

    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    DATA_DIR = os.path.join(ROOT_DIR, "server", "data", "covers")
    MODEL_DIR = os.path.join(ROOT_DIR, "server", "model", "pca_model_test")
    QUERY_DIR = os.path.join(ROOT_DIR, "server", "data", "query")
    COVER_DIR = os.path.join(ROOT_DIR, "server", "data", "covers")
    MAPPER_PATH = os.path.join(ROOT_DIR, "server", "data", "mapper.json")
    QUERY_PATH1 = os.path.join(QUERY_DIR, "tc1.png")
    QUERY_PATH2 = os.path.join(QUERY_DIR, "tc2.png")
    QUERY_PATH3 = os.path.join(QUERY_DIR, "tc3.jpg")


    # if os.path.exists(MODEL_DIR):
    #     print("Folder model PCA sudah ada", MODEL_DIR)

    # else:
    print("=== STARTING PCA FULL PIPELINE ===")
    print("\n[1] PREPROCESSING PCA (Membuat X_norm, mean, M)")
    PCA.create_pca_model1()
    print("\n[2] PREPROCESSING SVD (Membuat U, Sigma, V)")
    SVD.create_svd_model1(MODEL_DIR, k=100)   
    print("\n[3] PREPROCESSING dataset (Membuat C_dataset)")
    precompute_dataset_coefficients(MODEL_DIR)


    print("\nPROCESSING QUERY")
    image_files = sorted(os.listdir(COVER_DIR))
    book_ids = [fname.split('.')[0] for fname in image_files]  
    with open(MAPPER_PATH, "r") as f:
        mapper = json.load(f)

    # Test Case 1
    results = process_query(QUERY_PATH1, MODEL_DIR, top_k=10)
    print("\n=== TOP RESULTS ===\n")
    print("Rank | Index | Distance")
    print("------------------------")
    for i, (idx, dist) in enumerate(results, 1):
        book_id = book_ids[idx]
        title = mapper[book_id]["title"]
        print(f"{i:4} | {book_id:5} | {title} | distance =  {dist:.4f}")

    # Test Case 2
    results = process_query(QUERY_PATH2, MODEL_DIR, top_k=10)
    print("\n=== TOP RESULTS ===\n")
    print("Rank | Index | Distance")
    print("------------------------")
    for i, (idx, dist) in enumerate(results, 1):
        book_id = book_ids[idx]
        title = mapper[book_id]["title"]
        print(f"{i:4} | {book_id:5} | {title} | distance =  {dist:.4f}")

    # Test Case 3
    results = process_query(QUERY_PATH3, MODEL_DIR, top_k=10)
    print("\n=== TOP RESULTS ===\n")
    print("Rank | Index | Distance")
    print("------------------------")
    for i, (idx, dist) in enumerate(results, 1):
        book_id = book_ids[idx]
        title = mapper[book_id]["title"]
        print(f"{i:4} | {book_id:5} | {title} | distance =  {dist:.4f}")

    print("\n=== PCA MODEL FINISHED SUCCESSFULLY ===")
