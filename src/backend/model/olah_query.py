
# ------- Query ---------
from ..module import pca
import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle

def process_query_image(image_path, average, Uk):

    # print("gambar query dimasukan")
    path_query = image_path
    # "../data/query/16.jpg"

    image_query = Image.open(path_query)

    # Tampilkan gambar
    # # Visualize
    # plt.figure(figsize=(4, 6))
    # plt.imshow(image_query)
    # plt.axis('off')
    # plt.title("Query Image", fontsize=14, fontweight='bold')
    # plt.tight_layout()
    # plt.show()

    # Convert gambar query ke vektor normalisasi
    # print("Olah file query")

    matrix_rgb_query = pca.image_to_matrix(image_query) 
    # print(matrix_rgb)
    grayscale_query = pca.convert_to_grayscale(matrix_rgb_query) 
    # print(greyscale)
    vector_column_query = pca.matrix_to_column_vector(grayscale_query).reshape(-1)
    # print(matrix_column)

    column_vector_query_normalized = pca.normalization(vector_column_query, average)

    # print(f"vektor normalisasi kueri (xq) : {column_vector_data_normalized_query}")

    # print("Olah file query done")

    # SVD
    # print("--- SVD Query ----")
    # Uq = svd.svd(matrix_column_query, k)
    # Uq_T = Uq.T

    # Vektor koefisien kueri (cq)
    # print("koefisien query")
    cq = column_vector_query_normalized @ Uk

    # print("koefisien query done")

    return image_query, cq

    # print("SVD query done")


def find_similar_images(cq, coef_vector_data, jumlah):

    # -------------- Similarity --------------
    # print("Menghitung similarity")
    # Buat array of jarak untuk vektor koefisien
    array_jarak = np.zeros(jumlah, dtype=np.float32) 

    # Hitung jarak
    for i in range (jumlah):
        array_jarak[i] = pca.jarak(cq, coef_vector_data[i])

    # Sort dari jarak terlecil-tebesar
    ranking = np.argsort(array_jarak)

    return ranking, array_jarak

def visualization(images, image_query, ranking, array_jarak, filenames, top_k=10):
    """
    Visualize query and top-k most similar images
    
    Args:
        filenames: List of training image filenames
    """
    print(f"\n{'='*70}")
    print("GENERATING VISUALIZATION")
    print(f"{'='*70}")

    # Print top-k results
    print(f"\nTop {top_k} most similar images:")
    print(f"{'Rank':<6} {'Index':<8} {'Filename':<20} {'Distance':<12}")
    print("-"*50)
    for i in range(min(top_k, len(ranking))):
        idx = ranking[i]
        filename = filenames[idx]
        distance = array_jarak[idx]
        print(f"{i+1:<6} {idx:<8} {filename:<20} {distance:<12.4f}")

    # Create visualization
    fig, axes = plt.subplots(2, 6, figsize=(18, 6))

    # Query image
    axes[0, 0].imshow(image_query)
    axes[0, 0].set_title("QUERY", fontsize=12, fontweight='bold', color='red')
    axes[0, 0].axis('off')

    # Top-k results
    for i in range(min(top_k, len(ranking))):
        row = (i + 1) // 6
        col = (i + 1) % 6
        
        if row >= 2:
            break
        
        idx = ranking[i]
        filename = filenames[idx]
        distance = array_jarak[idx]
        
        axes[row, col].imshow(images[idx])
        axes[row, col].set_title(
            f"#{i+1}: {filename}\nD={distance:.2f}",  # ✅ Show filename!
            fontsize=9
        )
        axes[row, col].axis('off')

    plt.suptitle("PCA-Based Image Similarity Results", fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.show()

    print(f"\n{'='*70}")
    print("✅ VISUALIZATION COMPLETED!")
    print(f"{'='*70}")
