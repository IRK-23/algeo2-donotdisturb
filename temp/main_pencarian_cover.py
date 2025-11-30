from temp import pca_modelling
from backend.module import pca
from backend.model import olah_query
import numpy as np # Library untuk operasi matriks sederhana 
from PIL import Image # Library pengolahan file gambar
import matplotlib.pyplot as plt
import os
import json
import pickle

# Root project = folder yang berisi "src" dan "data"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_DIR = os.path.join(ROOT_DIR, "data")
QUERY_DIR = os.path.join(DATA_DIR, "query")
COVERS_DIR = os.path.join(DATA_DIR, "covers")
MODEL_DIR = os.path.join(ROOT_DIR, "src", "backend", "model", "pca_model")

if not os.path.exists(MODEL_DIR):
    # Folder tidak ditemukan
    print("Belum ada model")
    pca_modelling.create_pca_model()

# Load model pca
average, Uk, coef_vector_data, filenames, metadata = pca.load_pca_model(
    save_dir=MODEL_DIR
) 

# Process query
image_query, cq = olah_query.process_query_image(QUERY_DIR, average, Uk)

images = []
for filename in filenames:
    img_path = os.path.join(COVERS_DIR, filename)
    img = Image.open(img_path)
    images.append(img)

print(f"✅ Loaded {len(images)} images in correct order")

# plt.imshow(images[0])
# plt.show()

jumlah = len(images)

ranking, array_jarak = olah_query.find_similar_images(cq, coef_vector_data, jumlah)

olah_query.visualization(images, image_query, ranking, array_jarak, filenames, top_k = 11)