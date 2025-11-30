from .module import pca
from .module import svd
# from sklearn.decomposition import TruncatedSVD
import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle
import pandas as pd

# path ke root project berdasarkan lokasi file ini
def create_pca_model():
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR = os.path.join(ROOT_DIR, "data", "covers")

    # Load data gambar
    images, filenames = pca.load_images_from_folder(DATA_DIR)

    # ----------------------------- untuk debugging doang ----------------------
    # print("Data gambar 1 ") 
    # print(images[0])

    # ---------- show image ---------
    # img = images[0]
        
    # Menampilkan gambar dengan matplotlib
    # plt.imshow(img)
    # plt.axis('off')  # Menghilangkan axis untuk tampilan yang lebih bersih
    # plt.show()

    # ---------------------------------------------------

    print("MEMULAI PCA MODELLING")

    
    # Ambil jumlah data gambar
    jumlah = pca.count_images_file(DATA_DIR)

    # Convert file gambar menjadi vektor kolom
    print("Matrix pixel RGB to vector column")

    column_vector_data = np.zeros((jumlah, 200*300), dtype=np.float32) 

    for i in range(jumlah): 
        # Convert gambar menjadi matriks RGB
        matrix_rgb = pca.image_to_matrix(images[i]) 

        # Convert matriks pixel RGB ke grayscale
        matrix_grayscale = pca.convert_to_grayscale(matrix_rgb) 

        # Jadikan matriks kolom
        vector_column = pca.matrix_to_column_vector(matrix_grayscale) 

        # Simpan ke array
        column_vector_data[i] = vector_column

    print("Vektor kolom done")


    # Normalisasi
    print("Normalisasi vektor kolom")
    # Hitung average
    average = pca.hitung_rata2(column_vector_data)

    # Normalisasi vektor kolom gambar
    column_vector_data_normalized = np.zeros((jumlah, 200*300)) 

    for i in range(jumlah):
        column_vector_data_normalized[i] = pca.normalization(column_vector_data[i], average)
        # print(f"vektor normalisasi (x') ke-{i} : \n {column_vector_data_normalized[i]}")

    print("Normalisasi done")


    # Nilai K untuk k eigen teratas dengan rasio 95% dari total variansi
    print("--------- PCA ----------------")
    k = 100 # ambil k yang lebih akurat,  sekitar 95% data

    # INI DIA YANG MASIH AKAN DIPERBAIKI UNTUK SVD manual

    # Use randomized SVD for efficiency
    # from sklearn.utils.extmath import randomized_svd

    # X = U @ S @ V.T
    # U, S, Vt = randomized_svd(
    #     column_vector_data_normalized,
    #     n_components=k,
    #     random_state=42
    # )

    U, sigma, Vt = svd.svd_truncated(column_vector_data_normalized, k)

    # ----------------------------------

    Uk = Vt.T

    # Normalisasi komponen
    for i in range(k):
        norm = np.linalg.norm(Uk[:, i])
        Uk[:, i] = Uk[:, i] / norm
        
    print("PCA done")

    # vektor koefisien data gambar (ci)
    print("Vektor Koefisien ci")
    coef_vector_data = column_vector_data_normalized @ Uk
    print("koefisien vektor ci done")



    # SAVE MODEL

    model_dir = 'backend/model/pca_model'

    # Cek apakah folder belum ada
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)   # Buat folder
        print(f"Folder '{model_dir}' belum ada, membuat folder baru...")

    # Metadata
    metadata = {
        'k': k,
        'n_samples': jumlah,
        'image_width': 300,
        'image_height': 200,
        'training_date': '2024-11-22',
        'description': 'PCA model for book cover similarity'
    }

    # Save model
    pca.save_pca_model(
        average, 
        Uk, 
        coef_vector_data, 
        filenames,  # ✅ Pass filenames!
        metadata, 
        save_dir=model_dir
    )



# # -------------------------------------------------------------------------------

# # ============================================
# # PCA IMAGE SIMILARITY - FIXED VERSION
# # ============================================

# import numpy as np
# from PIL import Image
# import matplotlib.pyplot as plt
# import os

# # ============ FUNGSI UTILITY ============

# def count_images_file(folder):
#     ekstensi_gambar = (".jpg")
#     jumlah = 0
#     for file in os.listdir(folder):
#         if file.lower().endswith(ekstensi_gambar):
#             jumlah += 1
#     return jumlah

# def load_images_from_folder(folder_path):
#     images = []
#     for filename in sorted(os.listdir(folder_path)):
#         if filename.lower().endswith((".jpg")):
#             image_path = os.path.join(folder_path, filename)
#             img = Image.open(image_path)
#             images.append(img)
#     return images

# def image_to_matrix(image):
#     img = image.convert('RGB')
#     width, height = img.size
#     matrix = np.zeros((height, width, 3), dtype=int)
    
#     for y in range(height):
#         for x in range(width):
#             r, g, b = img.getpixel((x, y))
#             matrix[y, x] = [r, g, b]
    
#     return matrix

# def convert_to_grayscale(pixel_matrix):
#     """Convert RGB to grayscale and scale to [0, 1]"""
#     height, width, _ = pixel_matrix.shape
#     matrix_grayscale = np.zeros((height, width), dtype=float)

#     for y in range(height):
#         for x in range(width):
#             R = pixel_matrix[y, x, 0] * 0.2126
#             G = pixel_matrix[y, x, 1] * 0.7152
#             B = pixel_matrix[y, x, 2] * 0.0722
#             matrix_grayscale[y, x] = R + G + B
    
#     # ✅ CRITICAL: Scale to [0, 1]
#     matrix_grayscale = matrix_grayscale / 255.0
    
#     return matrix_grayscale

# def matrix_to_column_vector(matrix):
#     """Flatten 2D matrix to 1D vector"""
#     return matrix.flatten()

# def hitung_rata2(column_matrix):
#     """Compute mean across all samples"""
#     return np.mean(column_matrix, axis=0)

# def normalization(vector, mean_vector):
#     """Normalize by subtracting mean"""
#     return vector - mean_vector

# def jarak_euclidean(vec1, vec2):
#     """Compute Euclidean distance"""
#     return np.linalg.norm(vec1 - vec2)

# # ============================================
# # MAIN PROCESS
# # ============================================

# def main():
#     path = "/kaggle/input/project-gutenbergs-book-cover-and-content/covers"
    
#     print("="*70)
#     print("PHASE 1: LOADING & PREPROCESSING")
#     print("="*70)
    
#     # Load images
#     images = load_images_from_folder(path)
#     jumlah = count_images_file(path)
#     print(f"\n✅ Loaded {jumlah} images")
    
#     # Convert to grayscale vectors
#     print("\nConverting images to grayscale vectors...")
#     column_vector_data = np.zeros((jumlah, 200*300), dtype=np.float32)
    
#     for i in range(jumlah):
#         matrix_rgb = image_to_matrix(images[i])
#         matrix_grayscale = convert_to_grayscale(matrix_rgb)  # Already scaled to [0,1]
#         vector = matrix_to_column_vector(matrix_grayscale)
#         column_vector_data[i] = vector
        
#         if (i + 1) % 100 == 0:
#             print(f"  Processed {i+1}/{jumlah}...")
    
#     print(f"\n✅ Data shape: {column_vector_data.shape}")
#     print(f"  Value range: [{column_vector_data.min():.3f}, {column_vector_data.max():.3f}]")
    
#     # Compute mean
#     print("\nComputing mean vector...")
#     average = hitung_rata2(column_vector_data)
#     print(f"✅ Mean shape: {average.shape}")
#     print(f"  Mean value: {average.mean():.3f}")
    
#     # Normalize
#     print("\nNormalizing data...")
#     column_vector_data_normalized = np.zeros_like(column_vector_data)
    
#     for i in range(jumlah):
#         column_vector_data_normalized[i] = normalization(column_vector_data[i], average)
    
#     print(f"✅ Normalized data shape: {column_vector_data_normalized.shape}")
#     print(f"  Normalized mean: {column_vector_data_normalized.mean():.6f} (should be ~0)")
#     print(f"  Value range: [{column_vector_data_normalized.min():.3f}, {column_vector_data_normalized.max():.3f}]")
    
#     # ============================================
#     # PHASE 2: PCA (FIXED)
#     # ============================================
    
#     print("\n" + "="*70)
#     print("PHASE 2: PCA WITH PROPER NORMALIZATION")
#     print("="*70)
    
#     k = 20
#     print(f"\nComputing top {k} principal components...")
    
#     # Use randomized SVD for efficiency
#     from sklearn.utils.extmath import randomized_svd
    
#     # X = U @ S @ V.T
#     U, S, Vt = randomized_svd(
#         column_vector_data_normalized,
#         n_components=k,
#         random_state=42
#     )
    
#     print(f"\nSVD results:")
#     print(f"  U shape: {U.shape}")    # (jumlah, k)
#     print(f"  S shape: {S.shape}")    # (k,)
#     print(f"  Vt shape: {Vt.shape}")  # (k, 60000)
    
#     # ✅ CRITICAL FIX: Normalize principal components!
#     # Vt rows are already normalized by sklearn, but let's verify
#     Uk = Vt.T  # Shape: (60000, k)
    
#     # Normalize each column (principal component)
#     print("\nNormalizing principal components...")
#     for i in range(k):
#         norm = np.linalg.norm(Uk[:, i])
#         Uk[:, i] = Uk[:, i] / norm
    
#     Uk_T = Uk.T  # Shape: (k, 60000)
    
#     print(f"\n✅ Uk shape: {Uk.shape}")
#     print(f"✅ Uk_T shape: {Uk_T.shape}")
    
#     # Verify normalization
#     norms = [np.linalg.norm(Uk[:, i]) for i in range(min(5, k))]
#     print(f"  First 5 component norms: {norms}")
#     print(f"  Expected: all should be ~1.0")
    
#     # Compute coefficients for training data
#     print("\nComputing training coefficients...")
#     coef_vector_data = column_vector_data_normalized @ Uk  # (jumlah, 60000) @ (60000, k) = (jumlah, k)
    
#     print(f"✅ Coefficient matrix shape: {coef_vector_data.shape}")
#     print(f"  Value range: [{coef_vector_data.min():.3f}, {coef_vector_data.max():.3f}]")
#     print(f"  Mean: {coef_vector_data.mean():.3f}")
#     print(f"  Std: {coef_vector_data.std():.3f}")
    
#     # Sample coefficients
#     print(f"\nSample coefficients (first image):")
#     print(coef_vector_data[0])
    
#     # ============================================
#     # PHASE 3: QUERY PROCESSING (FIXED)
#     # ============================================
    
#     print("\n" + "="*70)
#     print("PHASE 3: QUERY IMAGE")
#     print("="*70)
    
#     path_query = "/kaggle/input/project-gutenbergs-book-cover-and-content/covers/16.jpg"
#     image_query = Image.open(path_query)
    
#     # Visualize
#     plt.figure(figsize=(4, 6))
#     plt.imshow(image_query)
#     plt.axis('off')
#     plt.title("Query Image", fontsize=14, fontweight='bold')
#     plt.tight_layout()
#     plt.show()
    
#     # Process query
#     print("\nProcessing query image...")
#     matrix_rgb_query = image_to_matrix(image_query)
#     matrix_grayscale_query = convert_to_grayscale(matrix_rgb_query)  # Scaled to [0,1]
    
#     # ✅ CRITICAL FIX: Flatten to 1D, NOT 2D!
#     matrix_column_query = matrix_to_column_vector(matrix_grayscale_query)
    
#     print(f"✅ Query vector shape: {matrix_column_query.shape}")
#     print(f"  Expected: (60000,)")
    
#     if matrix_column_query.shape != (60000,):
#         raise ValueError(f"Query shape is wrong! Got {matrix_column_query.shape}, expected (60000,)")
    
#     # ✅ CRITICAL: Normalize with TRAINING mean
#     column_vector_query_normalized = normalization(matrix_column_query, average)
    
#     print(f"✅ Query normalized shape: {column_vector_query_normalized.shape}")
#     print(f"  Value range: [{column_vector_query_normalized.min():.3f}, {column_vector_query_normalized.max():.3f}]")
#     print(f"  Mean: {column_vector_query_normalized.mean():.3f}")
    
#     # Compute query coefficients
#     print("\nComputing query coefficients...")
#     cq = column_vector_query_normalized @ Uk  # (60000,) @ (60000, 20) = (20,)
    
#     print(f"✅ cq shape: {cq.shape}")
#     print(f"  Expected: (20,)")
    
#     if cq.shape != (20,):
#         raise ValueError(f"cq shape is wrong! Got {cq.shape}, expected (20,)")
    
#     print(f"  cq values: {cq}")
#     print(f"  cq norm: {np.linalg.norm(cq):.3f}")
    
#     # ============================================
#     # PHASE 4: SIMILARITY
#     # ============================================
    
#     print("\n" + "="*70)
#     print("PHASE 4: COMPUTING SIMILARITY")
#     print("="*70)
    
#     # Compute distances
#     array_jarak = np.zeros(jumlah, dtype=np.float32)
    
#     for i in range(jumlah):
#         array_jarak[i] = jarak_euclidean(cq, coef_vector_data[i])
    
#     print(f"\n✅ Distance statistics:")
#     print(f"  Min: {array_jarak.min():.4f}")
#     print(f"  Max: {array_jarak.max():.4f}")
#     print(f"  Mean: {array_jarak.mean():.4f}")
#     print(f"  Median: {np.median(array_jarak):.4f}")
#     print(f"  Std: {array_jarak.std():.4f}")
    
#     # Ranking
#     ranking = np.argsort(array_jarak)
    
#     print("\n" + "="*70)
#     print("TOP 10 MOST SIMILAR IMAGES")
#     print("="*70)
#     print(f"{'Rank':<6} {'Image':<8} {'Distance':<12}")
#     print("-"*30)
    
#     for i in range(10):
#         idx = ranking[i]
#         print(f"{i+1:<6} {idx:<8} {array_jarak[idx]:<12.4f}")
    
#     # ============================================
#     # VISUALIZATION
#     # ============================================
    
#     print("\n" + "="*70)
#     print("GENERATING VISUALIZATION")
#     print("="*70)
    
#     fig, axes = plt.subplots(2, 6, figsize=(18, 6))
    
#     # Query
#     axes[0, 0].imshow(image_query)
#     axes[0, 0].set_title("QUERY", fontsize=12, fontweight='bold', color='red')
#     axes[0, 0].axis('off')
    
#     # Top 11 results
#     for i in range(11):
#         row = (i + 1) // 6
#         col = (i + 1) % 6
        
#         if row >= 2:
#             break
        
#         idx = ranking[i]
#         axes[row, col].imshow(images[idx])
#         axes[row, col].set_title(f"#{i+1}: Img{idx}\nD={array_jarak[idx]:.2f}", fontsize=9)
#         axes[row, col].axis('off')
    
#     plt.suptitle("PCA-Based Image Similarity Results", fontsize=16, fontweight='bold')
#     plt.tight_layout()
#     plt.show()
    
#     print("\n" + "="*70)
#     print("✅ PROCESS COMPLETED!")
#     print("="*70)
    
#     return {
#         'average': average,
#         'Uk': Uk,
#         'coef_vector_data': coef_vector_data,
#         'ranking': ranking,
#         'distances': array_jarak
#     }

# # Run
# if __name__ == "__main__":
#     results = main()