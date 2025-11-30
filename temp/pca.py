# Fungsi-Fungsi pembantu proses PCA

import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle


# Fungsi menghitung jumlah file gambar di dalam folder
def count_images_file(folder):
    ekstensi_gambar = (".jpg", ".jpeg", ".png")
    jumlah = 0
    for file in os.listdir(folder):
        if file.lower().endswith(ekstensi_gambar):
            jumlah += 1
    
    return jumlah

# fungsi load data
def load_images_from_folder(folder_path):
    images = []  # List untuk menyimpan gambar
    filenames = []
    for filename in sorted(os.listdir(folder_path)):  # Loop melalui semua file di folder
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):  # Filter file gambar
            image_path = os.path.join(folder_path, filename)  # Mendapatkan path lengkap gambar
            img = Image.open(image_path)  # Membuka gambar dalam format RGB
            images.append(img)  # Menambahkan gambar ke dalam list
            filenames.append(filename)

    return images, filenames  # Mengembalikan list gambar

# Fungsi untuk mengonversi gambar menjadi matriks piksel RGB
def image_to_matrix(image):    
    # Mengonversi gambar ke mode RGB jika belum dalam mode RGB
    img = image.convert('RGB')
    
    # Mendapatkan dimensi gambar (lebar dan tinggi)
    width, height = img.size
    
    # Membuat matriks kosong untuk menyimpan nilai piksel
    matrix = np.zeros((height, width, 3), dtype=int)  # Matriks 3D untuk RGB
    
    # Loop untuk mengambil nilai RGB dari setiap piksel dan menyimpannya dalam matriks
    for y in range(height):
        for x in range(width):
            # Mendapatkan nilai RGB dari piksel (x, y)
            r, g, b = img.getpixel((x, y))
            # Menyimpan nilai RGB ke dalam matriks
            matrix[y, x] = [r, g, b]
    
    return matrix

# konversi matriks gambar rgb ke gyscale

def convert_to_grayscale(pixel_matrix):
    height, width, _ = pixel_matrix.shape
    
    # Membuat matriks kosong untuk menyimpan nilai piksel
    matrix_grayscale = np.zeros((height, width), dtype=float)  # Matriks 3D untuk RGB

    for y in range(height):
        for x in range(width):
            R = pixel_matrix[y, x][0] * 0.2126 # Nilai Red 
            G = pixel_matrix[y, x][1] * 0.7152 # Nilai Green 
            B = pixel_matrix[y, x][2] * 0.0722 # Nilai Blue 
            matrix_grayscale[y, x] = R + G + B # nilai grayscale
    
    matrix_grayscale = matrix_grayscale / 255.0   
    
    return matrix_grayscale

# Fungsi merubah matriks menjadi vektor kolom
def matrix_to_column_vector(matrix):
    # Mengonversi matriks 2D menjadi matriks 1 kolom
    return matrix.flatten()  

# Fungsi Normalisasi vektor (di dalam loop)
def normalization (column_vector, mean_vector):
    # Normalisasi: mengurangi rata-rata dari setiap elemen vektor
    normalized = column_vector - mean_vector  # Mengurangi rata-rata dari setiap elemen dalam vektor
    
    return normalized     
        

def hitung_rata2 (column_matrix):
    return np.mean(column_matrix, axis=0)
    
# Fungsi menghitung jarak Euclidean antarvektor koefisien
def jarak(cq, ci):
    cq_flat = np.array(cq).flatten()
    ci_flat = np.array(ci).flatten()
    
    distance = 0
    for i in range(len(ci_flat)):
        distance += (cq_flat[i] - ci_flat[i])**2
        
    return np.sqrt(distance)    

# ============================================
# FUNGSI SAVE DATA
# ============================================
def save_pca_model(average, Uk, coef_vector_data, filenames, metadata, save_dir='pca_model'):
    """
    Simpan model PCA ke disk
    """
    import pandas as pd
    
    # Buat folder jika belum ada
    os.makedirs(save_dir, exist_ok=True)
    
    print(f"\n{'='*60}")
    print(f"SAVING PCA MODEL to {save_dir}")
    print(f"{'='*60}")

    # 1. Save mean vector
    np.save(os.path.join(save_dir, 'mean_vector.npy'), average)
    print(f"✅ Saved: mean_vector.npy | Shape: {average.shape}")
    
    # 2. Save principal components
    np.save(os.path.join(save_dir, 'principal_components.npy'), Uk)
    print(f"✅ Saved: principal_components.npy | Shape: {Uk.shape}")
    
    # 3. Save training coefficients
    np.save(os.path.join(save_dir, 'training_coefficients.npy'), coef_vector_data)
    print(f"✅ Saved: training_coefficients.npy | Shape: {coef_vector_data.shape}")
    
    # 4. Save training coefficients as CSV with filenames
    df_coef = pd.DataFrame(
        coef_vector_data,
        columns=[f'PC{i+1}' for i in range(coef_vector_data.shape[1])]
    )
    df_coef.insert(0, 'image_id', range(len(coef_vector_data)))
    df_coef.insert(1, 'filename', filenames)
    
    csv_path = os.path.join(save_dir, 'training_coefficients.csv')
    df_coef.to_csv(csv_path, index=False)
    print(f"✅ Saved: training_coefficients.csv | {len(df_coef)} rows")

    # 5. Save filename mapping (CRITICAL!) - WITH DEBUGGING
    print(f"\nDEBUG: Preparing to save filenames.json...")
    print(f"  Type: {type(filenames)}")
    print(f"  Length: {len(filenames)}")
    print(f"  First item type: {type(filenames[0]) if len(filenames) > 0 else 'N/A'}")
    
    # ✅ DEFENSIVE: Force conversion to clean string list
    try:
        # Method 1: List comprehension with explicit str()
        filenames_clean = [str(f) for f in filenames]
        
        # Verify it's JSON serializable
        test_json = json.dumps(filenames_clean[:3])
        print(f"  Test serialization (first 3): {test_json}")
        
        # Save
        filenames_path = os.path.join(save_dir, 'filenames.json')
        with open(filenames_path, 'w') as file:
            json.dump(filenames_clean, file, indent=2)
        
        print(f"✅ Saved: filenames.json | {len(filenames_clean)} files")
        
    except Exception as e:
        print(f"❌ ERROR saving filenames: {e}")
        print(f"\nTrying alternative method (pickle)...")
        
        # Fallback: Save as pickle instead
        filenames_path = os.path.join(save_dir, 'filenames.pkl')
        with open(filenames_path, 'wb') as file:
            pickle.dump(filenames, file)
        
        print(f"✅ Saved: filenames.pkl (pickle format) | {len(filenames)} files")
        print(f"⚠️  WARNING: Using pickle instead of JSON")

    # 6. Save metadata
    metadata_path = os.path.join(save_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Saved: metadata.json")
    
    # 7. Print file sizes
    print(f"\n{'File Sizes:'}")
    for filename in sorted(os.listdir(save_dir)):
        filepath = os.path.join(save_dir, filename)
        if os.path.isfile(filepath):
            size_mb = os.path.getsize(filepath) / (1024 * 1024)
            print(f"  {filename}: {size_mb:.2f} MB")
    
    print(f"\n✅ All model files saved successfully!")
    print(f"{'='*60}\n")


def load_pca_model(save_dir='pca_model'):
    """Load model PCA dari disk"""
    print(f"\n{'='*60}")
    print(f"LOADING PCA MODEL from {save_dir}")
    print(f"{'='*60}")
    
    # 1. Load mean vector
    average = np.load(os.path.join(save_dir, 'mean_vector.npy'))
    print(f"✅ Loaded: mean_vector.npy | Shape: {average.shape}")
    
    # 2. Load principal components
    Uk = np.load(os.path.join(save_dir, 'principal_components.npy'))
    print(f"✅ Loaded: principal_components.npy | Shape: {Uk.shape}")
    
    # 3. Load training coefficients
    coef_vector_data = np.load(os.path.join(save_dir, 'training_coefficients.npy'))
    print(f"✅ Loaded: training_coefficients.npy | Shape: {coef_vector_data.shape}")

    # 4. Load filenames - try JSON first, then pickle
    try:
        filenames_path = os.path.join(save_dir, 'filenames.json')
        with open(filenames_path, 'r') as f:
            filenames = json.load(f)
        print(f"✅ Loaded: filenames.json | {len(filenames)} files")
    except FileNotFoundError:
        # Try pickle fallback
        filenames_path = os.path.join(save_dir, 'filenames.pkl')
        with open(filenames_path, 'rb') as f:
            filenames = pickle.load(f)
        print(f"✅ Loaded: filenames.pkl | {len(filenames)} files")

    # 5. Load metadata
    metadata_path = os.path.join(save_dir, 'metadata.json')
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    print(f"✅ Loaded: metadata.json")
    
    print(f"\nModel Info:")
    for key, value in metadata.items():
        print(f"  {key}: {value}")
    
    print(f"\n✅ Model loaded successfully!")
    print(f"{'='*60}\n")
    
    return average, Uk, coef_vector_data, filenames, metadata