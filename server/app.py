# server/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import time
import json # Diperlukan untuk membaca file JSON

app = Flask(__name__)
# Mengaktifkan CORS untuk frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) 

# --- KONSTANTA LOKASI FILE DATA ---
DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'mapper.json')
BOOKS_PER_PAGE = 10 # Konstanta untuk pagination

# =========================================================
# FUNGSI UNTUK MEMUAT DATA BUKU DARI FILE JSON
# =========================================================
def load_book_data():
    """Memuat data buku dari file mapper.json."""
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as f:
            # Asumsi: mapper.json berisi list objek buku
            book_data = json.load(f)
            return book_data
    except FileNotFoundError:
        print(f"ERROR: File data tidak ditemukan di {DATA_FILE_PATH}")
        return [] # Kembalikan list kosong jika file tidak ditemukan
    except json.JSONDecodeError:
        print(f"ERROR: Format JSON di {DATA_FILE_PATH} tidak valid.")
        return []

# Memuat data sekali saat aplikasi dimulai (opsional, untuk caching)
book_list = load_book_data()
print(f"Berhasil memuat {len(book_list)} buku dari mapper.json.")


# =========================================================
# 1. ENDPOINT PENCARIAN FILE (POST) - Cover
# =========================================================
@app.route('/api/query_cover', methods=['POST'])
def query_cover():
    print("Menerima permintaan POST untuk Query Cover...")
    
    if 'cover_image' not in request.files:
        return jsonify({"error": "No cover_image part in the request"}), 400

    file = request.files['cover_image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = f"{int(time.time())}_{file.filename}"
        save_path = os.path.join('query_cover', filename)
        file.save(save_path)
        print(f"File disimpan di: {save_path}")
        
        # ⚠️ LAKUKAN ALGORITMA PENCARIAN DI SINI ⚠️
        # Anda akan menggunakan book_list yang dimuat oleh load_book_data()
        
        # --- MENGEMBALIKAN DATA DARI ALGORITMA ---
        # Untuk contoh, kita kembalikan beberapa buku dari mapper
        all_books = load_book_data()
        
        if not all_books:
            return jsonify({"books": [], "totalPages": 0}), 200

        # Hanya ambil 2 buku pertama sebagai hasil simulasi pencarian
        return jsonify({
            "books": all_books[:2],
            "totalPages": 1
        })

# ... (Endpoint query_content dan lainnya)

# =========================================================
# 3. ENDPOINT DATA DAN PAGINATION (GET) - Menggunakan data asli
# =========================================================
@app.route('/api/books', methods=['GET'])
def get_books():
    all_books = load_book_data()
    total_books = len(all_books)
    
    if not all_books:
        return jsonify({"books": [], "totalPages": 0}), 200

    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', BOOKS_PER_PAGE, type=int)
    
    # Logika Pagination
    start_index = (page - 1) * limit
    end_index = start_index + limit
    books_on_page = all_books[start_index:end_index]
    
    total_pages = (total_books + limit - 1) // limit # Pembulatan ke atas
    
    return jsonify({
        "books": books_on_page,
        "totalPages": total_pages
    })


if __name__ == '__main__':
    print("Flask Backend berjalan di http://localhost:5000")
    app.run(debug=True, port=5000)