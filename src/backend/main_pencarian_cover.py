from .module import pca
from .model import olah_query
import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle

model_dir = "backend/model/pca_model"

if not os.path.exists(model_dir):
    # Folder tidak ditemukan
    print("Belum ada model")
    create_pca_model()
    
# pENCARIAN COVER

# Load model
average, Uk, coef_vector_data, filenames, metadata = pca.load_pca_model(
    save_dir="backend/model/pca_model"
)

# Process query
query_folder_path = "../data/query"
image_query, cq = olah_query.process_query_image(query_folder_path, average, Uk)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(ROOT_DIR, "data", "covers")

images = []
for filename in filenames:
    img_path = os.path.join(DATA_DIR, filename)
    img = Image.open(img_path)
    images.append(img)

print(f"✅ Loaded {len(images)} images in correct order")

# plt.imshow(images[0])
# plt.show()

jumlah = len(images)

ranking, array_jarak = olah_query.find_similar_images(cq, coef_vector_data, jumlah)

olah_query.visualization(images, image_query, ranking, array_jarak, filenames, top_k = 11)