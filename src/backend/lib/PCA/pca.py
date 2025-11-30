# Fungsi-Fungsi pembantu proses PCA

import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle

# Fungsi membuat PCA model
class PCA:
    @staticmethod
    def create_pca_model1():
        ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        DATA_DIR = os.path.join(ROOT_DIR, "data", "covers")

        print("MEMULAI PCA MODELLING")

        # =====================================================
        # 1. Load gambar
        # =====================================================
        images, filenames = PCA.load_images_from_folder(DATA_DIR)
        jumlah = PCA.count_images_file(DATA_DIR)

        print(f"Jumlah gambar: {jumlah}")

        # =====================================================
        # 2. Convert ke grayscale vector (X)
        #    X akan berbentuk (60000, jumlah)
        # =====================================================
        print("Matrix pixel RGB to vector kolom...")

        img_dim = 200 * 300
        X = np.zeros((img_dim, jumlah), dtype=np.float32)

        for i in range(jumlah):
            rgb = PCA.image_to_matrix(images[i])
            gray = PCA.convert_to_grayscale(rgb)
            vec = PCA.matrix_to_column_vector(gray)  # shape = (60000,)
            X[:, i] = vec
            print(i)

        print("Konversi selesai. Shape X =", X.shape)
        # → (60000, 523)

        # =====================================================
        # 3. Hitung rata-rata dan normalisasi (X')
        # =====================================================
        print("Normalisasi data...")

        average = np.mean(X, axis=1, keepdims=True)    # shape: (60000, 1)
        X_norm = X - average                            # shape: (60000, 523)

        print("Normalisasi selesai. Shape X_norm =", X_norm.shape)

        # =====================================================
        # 4. Bentuk matriks kecil M = X_normᵀ X_norm  
        #    SESUAI PCA aman (523 x 523)
        # =====================================================
        print("Membentuk matriks kecil M = Xᵀ X ...")

        M = X_norm.T @ X_norm   # shape = (523, 523)

        print("Selesai membentuk M.")
        print("Shape M =", M.shape)

        # =====================================================
        # 5. Simpan hasil
        # =====================================================
        model_dir = os.path.join(ROOT_DIR, "src/backend/model/pca_model_test")
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)

        np.save(os.path.join(model_dir, "X_norm.npy"), X_norm) # matriks x normalisasi
        np.save(os.path.join(model_dir, "mean.npy"), average) # vektor rata-rata
        np.save(os.path.join(model_dir, "M_matrix.npy"), M) # matriks Xᵀ X

        metadata = {
            'n_samples': jumlah,
            'image_width': 300,
            'image_height': 200,
            'training_date': '2025-11-24 (last update)',
            'description': 'PCA preprocessing (M = X_norm^T X_norm, safe PCA)'
        }

        with open(os.path.join(model_dir, "metadata.json"), "w") as f:
            json.dump(metadata, f, indent=4)

    # Fungsi menghitung jumlah file gambar di dalam folder
    @staticmethod
    def count_images_file(folder):
        ekstensi_gambar = (".jpg", ".jpeg", ".png")
        jumlah = 0
        for file in os.listdir(folder):
            if file.lower().endswith(ekstensi_gambar):
                jumlah += 1

        return jumlah

    # Fungsi load data
    @staticmethod
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
    @staticmethod
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

    @staticmethod
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
    @staticmethod
    def matrix_to_column_vector(matrix):
        # Mengonversi matriks 2D menjadi matriks 1 kolom
        return matrix.flatten(order='F')  

    # Fungsi Normalisasi vektor (di dalam loop)
    @staticmethod
    def normalization (column_vector, mean_vector):
        # Normalisasi: mengurangi rata-rata dari setiap elemen vektor
        normalized = column_vector - mean_vector  # Mengurangi rata-rata dari setiap elemen dalam vektor
        
        return normalized     
            
    @staticmethod
    def hitung_rata2 (column_matrix):
        return np.mean(column_matrix, axis=0)
        
    # Fungsi menghitung jarak Euclidean antarvektor koefisien
    @staticmethod
    def jarak(cq, ci):
        cq_flat = np.array(cq).flatten()
        ci_flat = np.array(ci).flatten()
        
        distance = 0
        for i in range(len(ci_flat)):
            distance += (cq_flat[i] - ci_flat[i])**2
            
        return np.sqrt(distance)    